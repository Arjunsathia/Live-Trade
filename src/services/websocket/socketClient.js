class SocketClient {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectTimeout = 1000;
    this.url = import.meta.env.VITE_WS_URL || 'wss://ws.yourdomain.com/v1';
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket?.readyState === WebSocket.OPEN) return;

    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      if (token) {
        this.socket.send(JSON.stringify({ type: 'auth', token }));
      }
      this._emit('system', { type: 'system', event: 'connected' });
    };

    this.socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        this._emit(msg.type, msg);
      } catch (err) {
        console.error('Failed to parse WS message:', err);
      }
    };

    this.socket.onclose = () => {
      this.isConnected = false;
      this._emit('system', { type: 'system', event: 'disconnected' });
      this._attemptReconnect(token);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
      this.socket.close();
    };
  }

  _attemptReconnect(token) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++;
        this.connect(token);
      }, this.reconnectTimeout * Math.pow(2, this.reconnectAttempts));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  send(data) {
    if (this.isConnected && this.socket) {
      this.socket.send(typeof data === 'string' ? data : JSON.stringify(data));
    } else {
      console.warn('Cannot send message: WebSocket is not open');
    }
  }

  subscribe(type, handler) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type).add(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.listeners.get(type);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.listeners.delete(type);
        }
      }
    };
  }

  _emit(type, data) {
    const handlers = this.listeners.get(type);
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }
}

// Export singleton instance
export const wsClient = new SocketClient();
