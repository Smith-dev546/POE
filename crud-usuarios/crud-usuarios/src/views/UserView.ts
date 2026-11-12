import { USE_API } from '../config';
import type { User } from '../models/UserModel';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const esc = (s: unknown) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

export class UserView {
  private form = $<HTMLFormElement>('userForm');
  private nameInput = $<HTMLInputElement>('name');
  private emailInput = $<HTMLInputElement>('email');
  private tableBody = $<HTMLTableSectionElement>('userTableBody');
  private message = $<HTMLDivElement>('message');
  private search = $<HTMLInputElement>('search');
  private pageSize = $<HTMLSelectElement>('pageSize');
  private pageInfo = $<HTMLSpanElement>('pageInfo');
  private prevBtn = $<HTMLButtonElement>('prev');
  private nextBtn = $<HTMLButtonElement>('next');
  private authSection = $<HTMLElement>('authSection');
  private appSection = $<HTMLElement>('appSection');
  private authForm = $<HTMLFormElement>('authForm');
  private authEmail = $<HTMLInputElement>('authEmail');
  private authPassword = $<HTMLInputElement>('authPassword');
  private logoutBtn = $<HTMLButtonElement>('logoutBtn');
  private editingId: number | null = null;
  private timer: number | undefined;

  constructor() {
    $('modeLabel').textContent = USE_API
      ? '🌐 Backend Node.js + SQLite · con autenticación'
      : '💾 SQLite en el navegador · persistido en IndexedDB';
  }

  getFormData(): { name: string; email: string } {
    return { name: this.nameInput.value.trim(), email: this.emailInput.value.trim() };
  }

  renderTable(users: User[], filtered: boolean): void {
    if (users.length === 0) {
      const text = filtered ? 'Sin resultados para la búsqueda' : 'No hay usuarios registrados';
      this.tableBody.innerHTML = `<tr><td colspan="4" class="empty">${text}</td></tr>`;
      return;
    }
    this.tableBody.innerHTML = users.map((u) => `
      <tr>
        <td>${esc(u.id)}</td>
        <td>${esc(u.name)}</td>
        <td>${esc(u.email)}</td>
        <td>
          <button class="btn-edit" data-id="${esc(u.id)}" data-action="edit">✏️ Editar</button>
          <button class="btn-delete" data-id="${esc(u.id)}" data-action="delete">🗑️ Eliminar</button>
        </td>
      </tr>`).join('');
  }

  renderPager(page: number, pages: number, total: number): void {
    this.pageInfo.textContent = `Página ${page} de ${pages} · ${total} resultado${total === 1 ? '' : 's'}`;
    this.prevBtn.disabled = page <= 1;
    this.nextBtn.disabled = page >= pages;
  }

  showMessage(text: string, type: 'success' | 'error'): void {
    clearTimeout(this.timer);
    this.message.textContent = text;
    this.message.className = `message ${type}`;
    this.timer = window.setTimeout(() => {
      this.message.textContent = '';
      this.message.className = 'message';
    }, 3000);
  }

  showAuth(show: boolean): void {
    this.authSection.hidden = !show;
    this.appSection.hidden = show;
    this.logoutBtn.hidden = show || !USE_API;
  }

  resetAuth(): void { this.authForm.reset(); }

  loadUserForEdit(user: User): void {
    this.nameInput.value = user.name;
    this.emailInput.value = user.email;
    this.editingId = user.id!;
    this.form.querySelector('button[type="submit"]')!.textContent = '💾 Actualizar';
  }

  resetForm(): void {
    this.form.reset();
    this.editingId = null;
    this.form.querySelector('button[type="submit"]')!.textContent = '➕ Agregar Usuario';
  }

  getEditingId(): number | null { return this.editingId; }

  // ---------- Eventos ----------
  bindSubmit(handler: (name: string, email: string) => void): void {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const { name, email } = this.getFormData();
      handler(name, email);
    });
  }

  bindTableActions(onEdit: (id: number) => void, onDelete: (id: number) => void): void {
    this.tableBody.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-action]');
      if (!btn) return;
      const id = Number(btn.dataset.id);
      if (btn.dataset.action === 'edit') onEdit(id);
      else onDelete(id);
    });
  }

  bindSearch(handler: (q: string) => void): void {
    let t: number | undefined;
    this.search.addEventListener('input', () => {
      clearTimeout(t); // debounce: espera a que el usuario deje de escribir
      t = window.setTimeout(() => handler(this.search.value.trim()), 250);
    });
  }

  bindPager(onPrev: () => void, onNext: () => void, onSize: (n: number) => void): void {
    this.prevBtn.addEventListener('click', onPrev);
    this.nextBtn.addEventListener('click', onNext);
    this.pageSize.addEventListener('change', () => onSize(Number(this.pageSize.value)));
  }

  bindExport(handler: () => void): void {
    $('exportBtn').addEventListener('click', handler);
  }

  bindAuth(onLogin: (e: string, p: string) => void, onRegister: (e: string, p: string) => void): void {
    const creds = (): [string, string] => [this.authEmail.value.trim(), this.authPassword.value];
    this.authForm.addEventListener('submit', (ev) => { ev.preventDefault(); onLogin(...creds()); });
    $('registerBtn').addEventListener('click', () => {
      if (this.authForm.reportValidity()) onRegister(...creds());
    });
  }

  bindLogout(handler: () => void): void {
    this.logoutBtn.addEventListener('click', handler);
  }
}
