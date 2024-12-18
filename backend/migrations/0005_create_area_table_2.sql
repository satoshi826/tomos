-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Area" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Area" ("createdAt", "id", "name", "updatedAt", "x", "y") SELECT "createdAt", "id", "name", "updatedAt", "x", "y" FROM "Area";
DROP TABLE "Area";
ALTER TABLE "new_Area" RENAME TO "Area";
CREATE INDEX "Area_x_y_updatedAt_idx" ON "Area"("x", "y", "updatedAt");
CREATE UNIQUE INDEX "Area_x_y_key" ON "Area"("x", "y");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
