import { USE_API } from '../config';
import { UserModel, type User } from '../models/UserModel';
import { Auth } from '../services/Api';
import { UserView } from '../views/UserView';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class UserController {
  private view = new UserView();
  private q = '';
  private page = 1;
  private pageSize = 10;
  private current: User[] = [];

  constructor() {
    const v = this.view;
    v.bindSubmit((n, e) => this.handleSubmit(n, e));
    v.bindTableActions((id) => this.handleEdit(id), (id) => this.handleDelete(id));
    v.bindSearch((q) => { this.q = q; this.page = 1; void this.refresh(); });
    v.bindPager(
      () => { this.page--; void this.refresh(); },
      () => { this.page++; void this.refresh(); },
      (size) => { this.pageSize = size; this.page = 1; void this.refresh(); }
    );
    v.bindExport(() => this.exportCsv());

    if (USE_API) {
      v.bindAuth((e, p) => this.handleAuth('login', e, p), (e, p) => this.handleAuth('register', e, p));
      v.bindLogout(() => { Auth.logout(); v.showAuth(true); });
      window.addEventListener('auth:expired', () => v.showAuth(true));
    }

    const needsLogin = USE_API && !Auth.isLoggedIn();
    v.showAuth(needsLogin);
    if (!needsLogin) void this.refresh();
  }

  private fail(e: unknown): void {
    this.view.showMessage(e instanceof Error ? e.message : 'Error inesperado', 'error');
  }

  private async handleAuth(mode: 'login' | 'register', email: string, password: string): Promise<void> {
    try {
      if (mode === 'login') await Auth.login(email, password);
      else await Auth.register(email, password);
      this.view.resetAuth();
      this.view.showAuth(false);
      this.page = 1;
      await this.refresh();
    } catch (e) { this.fail(e); }
  }

  private async handleSubmit(name: string, email: string): Promise<void> {
    if (!name || !email) return this.view.showMessage('Por favor completa todos los campos', 'error');
    if (!EMAIL_RE.test(email)) return this.view.showMessage('El email no es válido', 'error');

    const editingId = this.view.getEditingId();
    try {
      if (editingId !== null) {
        await UserModel.update(editingId, name, email);
        this.view.showMessage('✅ Usuario actualizado', 'success');
      } else {
        await UserModel.create(name, email);
        this.view.showMessage('✅ Usuario agregado', 'success');
        this.page = 1; // los nuevos aparecen primero (ORDER BY id DESC)
      }
      this.view.resetForm();
      await this.refresh();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al guardar';
      this.view.showMessage(msg.includes('UNIQUE') ? 'El email ya está registrado' : msg, 'error');
    }
  }

  private handleEdit(id: number): void {
    const user = this.current.find((u) => u.id === id);
    if (user) this.view.loadUserForEdit(user);
  }

  private async handleDelete(id: number): Promise<void> {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    try {
      await UserModel.remove(id);
      this.view.showMessage('🗑️ Usuario eliminado', 'success');
      await this.refresh();
    } catch (e) { this.fail(e); }
  }

  private async refresh(): Promise<void> {
    try {
      const r = await UserModel.list(this.q, this.page, this.pageSize);
      this.page = r.page; // el modelo corrige la página si quedó fuera de rango
      this.current = r.users;
      this.view.renderTable(r.users, this.q !== '');
      this.view.renderPager(r.page, Math.max(1, Math.ceil(r.total / r.pageSize)), r.total);
    } catch (e) { this.fail(e); }
  }

  /** Exporta TODOS los resultados del filtro actual (no solo la página visible) */
  private async exportCsv(): Promise<void> {
    try {
      const users = await UserModel.all(this.q);
      const cell = (v: unknown) => {
        let s = String(v ?? '');
        if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; // evita inyección de fórmulas en Excel
        return `"${s.replace(/"/g, '""')}"`;
      };
      const csv = ['id,nombre,email', ...users.map((u) => [u.id, u.name, u.email].map(cell).join(','))].join('\r\n');
      const url = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `usuarios-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) { this.fail(e); }
  }
}
