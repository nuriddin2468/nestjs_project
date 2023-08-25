import { Prisma, PrismaClient, Role } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Resetting database...');
  await prisma.company.deleteMany();

  console.log('Creating companies...');
  await createCompanies();

  await prisma.user.create({
    data: {
      firstname: 'Nuriddin',
      lastname: 'Yuldashev',
      email: 'huskforever@gmail.com',
      password: await hashPassword('agent007'),
      role: Role.ADMIN,
      cash: 10000000,
      company: {
        create: {
          title: 'Administrator Company',
          logo: '',
        },
      },
    },
  });

  const companies = await prisma.company.findMany();
  for (const company of companies) {
    console.log(
      `Seeding company: ${company.title} | ${
        companies.findIndex((res) => res === company) + 1
      }/${companies.length}`
    );
    await createSchools(faker.number.int({ min: 0, max: 4 }), company.id);

    const schools = await prisma.school.findMany({
      where: {
        companyId: company.id,
      },
    });

    for (const school of schools) {
      console.log(
        `Seeding school: ${school.title} | ${
          schools.findIndex((res) => res === school) + 1
        }/${schools.length}`
      );
      await createUsers(
        faker.number.int({ min: 0, max: 40 }),
        company.id,
        school.id
      );

      await createRooms(faker.number.int({ min: 0, max: 10 }), school.id);
    }
  }
}

function createRooms(count = 10, schoolId: string) {
  const data: Prisma.RoomCreateManyInput[] = [];
  for (let i = 0; i < count; i++) {
    data.push({
      title: `room ${i}`,
      schoolId,
    });
  }
  return prisma.room.createMany({ data });
}

function createSchools(count = 3, companyId: string) {
  const data: Prisma.SchoolCreateManyInput[] = [];
  for (let i = 0; i < count; i++) {
    data.push({
      title: faker.company.name(),
      companyId,
    });
  }
  return prisma.school.createMany({ data });
}

function createCompanies(count = 10) {
  const data: Prisma.CompanyCreateManyInput[] = [];
  for (let i = 0; i < count; i++) {
    data.push({
      title: faker.company.name(),
      logo: faker.image.avatar(),
    });
  }
  return prisma.company.createMany({ data });
}

async function createUsers(count = 30, companyId: string, schoolId: string) {
  const data: Prisma.UserCreateManyInput[] = [];
  const roles: Role[] = [Role.STUDENT, Role.TEACHER];
  for (let i = 0; i < count; i++) {
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    data.push({
      email: faker.internet.email({
        firstName: faker.string.uuid(),
        lastName: faker.person.lastName(),
      }),
      password: await hashPassword('test1234'),
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      role: randomRole,
      companyId,
      schoolId,
      sex: faker.person.sexType() === 'male' ? 'MALE' : 'FEMALE',
      phone: faker.phone.number(),
      cash: faker.number.int({ min: 10000, max: 3000000 }),
      birthdate: faker.date.birthdate(),
    });
  }
  if (data.length) {
    data[0].role = Role.DIRECTOR;
    data[0].schoolId = null;
  }
  await prisma.user.createMany({ data });
  await createTeachers();
  await createStudents();
}

async function createStudents() {
  const students = await prisma.user.findMany({
    where: { role: Role.STUDENT, studentInfo: null },
  });
  return prisma.student.createMany({
    data: students.map((res) => ({
      id: res.id,
    })),
  });
}

async function createTeachers() {
  const teachers = await prisma.user.findMany({
    where: { role: Role.TEACHER, teacherInfo: null },
  });
  return prisma.teacher.createMany({
    data: teachers.map((res) => ({
      id: res.id,
    })),
  });
}

function hashPassword(password: string) {
  return hash(password, 10);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
