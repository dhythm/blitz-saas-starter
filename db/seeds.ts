import { SecurePassword } from "@blitzjs/auth"
import db, { Action, Domain } from "./index"

/*
 * This seed function is executed when you run `blitz db seed`.
 *
 * Probably you want to use a library like https://chancejs.com
 * to easily generate realistic data.
 */
const seed = async () => {
  try {
    const promises: any[] = []
    for (const domain of Object.keys(Domain) as (keyof typeof Domain)[]) {
      for (const action of Object.keys(Action) as (keyof typeof Action)[]) {
        const name = `${domain}${action.charAt(0).toUpperCase() + action.slice(1)}`
        if (!(await db.ability.findUnique({ where: { name } }))) {
          promises.push(
            db.ability.create({
              data: {
                name,
                domain,
                action,
              },
            })
          )
        }
      }
    }
    await Promise.allSettled(promises)

    const organizations = await Promise.all(
      [
        {
          organizationCode: "0001",
          name: "organization1",
        },
        {
          organizationCode: "0002",
          name: "organization2",
        },
      ].map(({ organizationCode, name }) =>
        db.organization.upsert({
          where: {
            organizationCode,
          },
          create: {
            organizationCode,
            name,
          },
          update: {},
        })
      )
    )

    const queryAbilities = await db.ability.findMany({
      where: {
        action: "query",
      },
      select: {
        id: true,
      },
    })
    const mutateAbilities = await db.ability.findMany({
      where: {
        action: "mutate",
      },
      select: {
        id: true,
      },
    })

    if (!organizations[0]) return

    await db.role.upsert({
      where: {
        organizationCode_name: {
          organizationCode: organizations[0].organizationCode,
          name: "viewer",
        },
      },
      create: {
        organizationCode: organizations[0].organizationCode,
        name: "viewer",
        abilities: {
          connect: queryAbilities,
        },
      },
      update: {},
    })
    const adminRole = await db.role.upsert({
      where: {
        organizationCode_name: {
          organizationCode: organizations[0].organizationCode,
          name: "admin",
        },
      },
      create: {
        organizationCode: organizations[0].organizationCode,
        name: "admin",
        abilities: {
          connect: mutateAbilities,
        },
      },
      update: {},
    })

    const hashedPassword = await SecurePassword.hash("Password1!")
    await db.user.upsert({
      where: {
        organizationCode_email: {
          organizationCode: organizations[0].organizationCode,
          email: "kody@test.remix.run",
        },
      },
      create: {
        organizationCode: organizations[0].organizationCode,
        name: "kody",
        email: "kody@test.blitz.com",
        hashedPassword,
        roleId: adminRole.id,
      },
      update: {},
    })
  } catch (error) {
    console.error(error)
  }
}

export default seed
