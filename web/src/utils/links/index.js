export default {
    canyons: {
        new: () => {
            return "/canyons/new";
        },

        show: (canyon) => {
            if (typeof canyon === "string") {
                return `/canyons/${canyon}`;
            } else {
                return `/canyons/${canyon.get("slug")}`;
            }
        },

        edit: (canyon) => {
            return `/canyons/${canyon.get("slug")}/edit`;
        },

        tripReports: (canyon) => {
            return {
                new: () => {
                    return `/canyons/${canyon.get("slug")}/trip-reports/new`;
                }
            };
        }
    }
};
