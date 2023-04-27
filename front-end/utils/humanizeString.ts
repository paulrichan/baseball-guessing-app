export function humanizeString(str: string): string {
   // Separate the original string into individual words based on capitalization
   const words = str.split(/(?=[A-Z])/)
   const humanizedStr = words
      .join(' ')
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase())

   return humanizedStr
}
