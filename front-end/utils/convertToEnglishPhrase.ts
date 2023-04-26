export function convertToEnglishPhrase(key: string) {
   const words = key.replace(/[A-Z]/g, ' $&').trim().split(' ')
   const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
   return capitalizedWords.join(' ')
}
