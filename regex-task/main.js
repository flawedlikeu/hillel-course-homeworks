console.log('#11. JavaScript homework example file')

/*
 * #1
 *
 * Написати функцію, яка приймає рядок як вхідний параметр і перевіряє, чи є цей рядок валідною електронною адресою за допомогою регулярного виразу.
 * Функція повертає true, якщо електронна адреса валідна, і false в іншому випадку.
 *
 */

function isValidEmail(email) {
  if (typeof email !== 'string') return false
  const emailRegex =
    /^[a-zA-Z0-9_%+-]+(\.[a-zA-Z0-9_%+-]+)*@([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/

  return emailRegex.test(email)
}

console.log(isValidEmail('example@example.com')) // Повинно вивести: true
console.log(isValidEmail('invalid-email')) // Повинно вивести: false

/*
 * #2
 *
 * Написати функцію, яка приймає рядок як вхідний параметр і перевіряє, чи є цей рядок валідним URL веб-сайту за допомогою регулярного виразу.
 * Функція повертає true, якщо URL валідний, і false в іншому випадку.
 *
 */

function isValidUrl(url) {
  if (typeof url !== 'string') return false
  const urlRegex =
    /^https?:\/\/([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(:\d{1,5})?(\/[^\s?#]*)?(\?[^\s#]*)?(#\S*)?$/

  return urlRegex.test(url)
}

console.log(isValidUrl('https://www.example.com'))
console.log(isValidUrl('invalid-url'))

export { isValidEmail, isValidUrl }
