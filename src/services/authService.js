const USERS_KEY = 'Agriva_registered_users';
const CURRENT_USER_KEY = 'Agriva_user';

export const authService = {
  getStoredUsers() {
    try {
      const data = localStorage.getItem(USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getCurrentUser() {
    try {
      const user = localStorage.getItem(CURRENT_USER_KEY);
      if (!user) return null;
      const parsed = JSON.parse(user);
      // Cleanse any legacy mock address from previously stored demo user
      if (parsed && Array.isArray(parsed.addresses)) {
        parsed.addresses = parsed.addresses.filter(
          (a) => a.id !== 'addr_default' && a.address !== 'Flat 402, Green View Residency, Baner'
        );
      }
      return parsed;
    } catch {
      return null;
    }
  },

  async login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = this.getStoredUsers();
        // Check registered mock users
        const matched = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (matched) {
          const sessionUser = {
            id: matched.id,
            name: matched.name,
            email: matched.email,
            phone: matched.phone || '',
            addresses: matched.addresses || []
          };
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
          resolve(sessionUser);
          return;
        }

        // Demo user fallback: allow demo login
        if (password.length >= 6) {
          const demoUser = {
            id: 'usr_' + Date.now(),
            name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            email: email,
            phone: '',
            addresses: []
          };
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(demoUser));
          resolve(demoUser);
        } else {
          reject(new Error('Invalid password. Minimum 6 characters required.'));
        }
      }, 100);
    });
  },

  async register({ name, email, phone, password }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = this.getStoredUsers();
        if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
          reject(new Error('An account with this email address already exists.'));
          return;
        }

        const newUser = {
          id: 'usr_' + Date.now(),
          name,
          email,
          phone,
          password,
          addresses: []
        };

        users.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        const sessionUser = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          addresses: []
        };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
        resolve(sessionUser);
      }, 100);
    });
  },

  logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    return Promise.resolve();
  },

  async updateProfile(updates) {
    const current = this.getCurrentUser();
    if (!current) throw new Error('Not authenticated');
    const updated = { ...current, ...updates };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
    return Promise.resolve(updated);
  }
};
