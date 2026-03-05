-- CreateTable
CREATE TABLE "classrooms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shift" TEXT NOT NULL DEFAULT 'MAÑANA',
    "capacity" INTEGER NOT NULL DEFAULT 30,
    "gradeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "classrooms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "classrooms_gradeId_name_shift_key" ON "classrooms"("gradeId", "name", "shift");

-- AddForeignKey
ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "grades"("id") ON DELETE CASCADE ON UPDATE CASCADE;
