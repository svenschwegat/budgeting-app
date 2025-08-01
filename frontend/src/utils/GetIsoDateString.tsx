/** This function returns the first to of the month in YYYY-MM-DD format. 
 * @param {Date|string} date If the date is not provided, it defaults to the current date.
 * @param {boolean} endOfMonth If endOfMonth is true, it returns the last day of the month instead.
 */
export function getIsoDateString(date?: Date | string, endOfMonth: boolean = false): string {
    if(!date){
        date = new Date();
    }

    if(typeof date === 'string'){
        date = new Date(date);
    }

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = endOfMonth 
        ? new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate().toString().padStart(2, '0')
        : '01';

    return `${year}-${month}-${day}`;
}