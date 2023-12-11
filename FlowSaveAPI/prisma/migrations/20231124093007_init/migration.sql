-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#0000FF',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "maxAmount" REAL DEFAULT 500
);
INSERT INTO "new_Category" ("color", "createdAt", "id", "maxAmount", "name", "type", "updatedAt") SELECT "color", "createdAt", "id", "maxAmount", "name", "type", "updatedAt" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE TABLE "new_CustomCategory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#0000FF',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isCustom" BOOLEAN NOT NULL DEFAULT true,
    "userId" INTEGER NOT NULL,
    "maxAmount" REAL DEFAULT 500,
    CONSTRAINT "CustomCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CustomCategory" ("color", "createdAt", "id", "maxAmount", "name", "type", "updatedAt", "userId") SELECT "color", "createdAt", "id", "maxAmount", "name", "type", "updatedAt", "userId" FROM "CustomCategory";
DROP TABLE "CustomCategory";
ALTER TABLE "new_CustomCategory" RENAME TO "CustomCategory";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
