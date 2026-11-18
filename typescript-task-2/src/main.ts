console.log('#20. TypeScript homework example file')

interface PersonInterface {
  name: string
  age: number
  isActive: boolean
}

function createPerson(name: string, age: number, isActive: boolean): PersonInterface {
  return { name, age, isActive }
}

const newPerson = createPerson('Олександр', 31, false)
console.log(newPerson)

function LogMethodCalls(target: any, propertyName: string, propertyDescriptor: PropertyDescriptor): PropertyDescriptor {
  const originalMethod = propertyDescriptor.value

  propertyDescriptor.value = function (this: typeof target, ...args: unknown[]) {
    console.log(`Calling "${propertyName}" with arguments: ${args.join(', ')}`)
    return originalMethod.apply(this, args)
  }

  return propertyDescriptor
}

class Calculator {
  @LogMethodCalls
  add(a: number, b: number): number {
    return a + b
  }

  @LogMethodCalls
  multiply(a: number, b: number): number {
    return a * b
  }
}

const calculator = new Calculator()
console.log(calculator.add(2, 3))
console.log(calculator.multiply(3, 4))

namespace UserProfile {
  export interface ProfileInterface {
    id: string
    name: string
    email: string
  }

  function generateId(): string {
    return Math.random().toString(36).slice(2, 13)
  }

  export function createProfile(name: string, email: string): ProfileInterface {
    return { id: generateId(), name, email }
  }
}

const profile = UserProfile.createProfile('John Doe', 'john@example.com')
console.log(profile)

export { createPerson, Calculator, UserProfile }
