import { DB } from 'mongoloquent'

try {
  // Clean up existing data
  await DB.collection('users').delete()
  await DB.collection('categories').delete()

  await DB.collection('users').insertMany([
    {
      name: "Admin",
      email: "admin@mail.com",
      password: await Bun.password.hash("qweqwe"),
      role: "admin"
    },
    {
      name: "Reseller",
      email: "reseller@mail.com",
      password: await Bun.password.hash("qweqwe"),
      role: "reseller"
    }
  ])

  await DB.collection('categories').insertMany([
    { name: "T-Shirt" },
    { name: "Hoodie" },
    { name: "Jacket" },
    { name: "Pants" },
    { name: "Shoes" },
  ])
} catch (error) {
  console.log(error);

} finally {
  console.log("Seeding completed");
  process.exit(0)
}