-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "googleId" TEXT,
    "name" TEXT NOT NULL,
    "color" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- userIdにランダムな文字列を設定してデータを挿入
INSERT INTO "new_User" ("color", "createdAt", "googleId", "id", "name", "userId")
SELECT "color", "createdAt", "googleId", "id", "name", abs(random()) || abs(random()) FROM "User";

DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";

CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
CREATE INDEX "User_googleId_idx" ON "User"("googleId");
CREATE INDEX "User_userId_idx" ON "User"("userId");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
