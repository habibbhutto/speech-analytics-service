class Config {
  required(param: string) {
    if (process.env[param]) {
      return process.env[param];
    }

    throw new Error(`${param} is required`);
  }

  env() {
    return this.required('APP_ENV') || 'test';
  }

  server() {
    return {
      PORT: process.env.PORT || 8080,
      HOST: process.env.HOST || '0.0.0.0',
    };
  }

  db() {
    return {
      PG_HOST: this.required('PG_HOST'),
      PG_USER: this.required('PG_USER'),
      PG_PASSWORD: this.required('PG_PASSWORD'),
      PG_PORT: this.required('PG_PORT'),
      PG_DATABASE: this.required('PG_DATABASE'),
    };
  }

  dbUrl() {
    const db = this.db();
    const credentials = `${db.PG_USER}:${db.PG_PASSWORD}`;
    const host = `${db.PG_HOST}:${db.PG_PORT}`;
    return `postgres://${credentials}@${host}/${db.PG_DATABASE}`;
  }
}

export default new Config();
