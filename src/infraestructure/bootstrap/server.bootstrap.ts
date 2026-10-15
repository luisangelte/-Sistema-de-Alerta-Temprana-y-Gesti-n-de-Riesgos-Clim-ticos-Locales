import express from "express";
import http from "http";
import envs from '../config/environment-vars';

export class ServerBootstrap {
  private app: express.Application;

  constructor(app: express.Application) {
    this.app = app;
  }

  initialize(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const server = http.createServer(this.app);
      const PORT = Number(envs.PORT ?? 4000);
      server.listen(PORT)
      .on("listening",()=>{
       console.log(`Server running at http://localhost:${PORT}`);
       resolve(true);
      })
       .on("error",(err)=>{
       console.log(`Se ha generado un error:${err}`);
       reject(false);
      })
    });
  }
}
