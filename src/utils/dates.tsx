// Get date object from any valid string
export const getDate = (dateString: string | number): Date => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
    }
    return date;
};

// Supported format options
type DateFormat = "YYYY-MM-DD" | "DD/MM/YYYY" | "MM/DD/YYYY" | "Mon dd";

// Get date in specified format
export const formatDate = (date: string | Date, format: DateFormat = "YYYY-MM-DD"): string => {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
        throw new Error("Invalid date provided");
    }

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    switch (format) {
        case "YYYY-MM-DD":
            return `${year}-${month}-${day}`;

        case "DD/MM/YYYY":
            return `${day}/${month}/${year}`;

        case "MM/DD/YYYY":
            return `${month}/${day}/${year}`;

        case "Mon dd":
            const monthNames = [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
            return `${monthNames[d.getMonth()]} ${day}`;

        default:
            throw new Error(`Unsupported date format: ${format}`);
    }
};
