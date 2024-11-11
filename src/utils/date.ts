export const formatDateTime = (row, column) => {
    const formatNumber = function (number) {
        return number < 10 ? "0" + number : number;
    };
    const dateTime = row[column.property];
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = formatNumber(date.getMonth() + 1);
    const day = formatNumber(date.getDate());
    const hours = formatNumber(date.getHours());
    const minutes = formatNumber(date.getMinutes());
    const seconds = formatNumber(date.getSeconds());
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
