import { PrismaClient } from '@prisma/client';

declare global {
  var __db: PrismaClient | undefined;
}

function getDB(): PrismaClient {
  if (process.env.NODE_ENV === 'production') {
    return new PrismaClient();
  }

  //? 개발환경에서는 글로벌 인스턴스를 만들어 사용한다.
  if (!global.__db) {
    global.__db = new PrismaClient();
  }

  return global.__db;
}

const db = getDB();

export { db };
