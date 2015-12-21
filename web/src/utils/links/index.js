export default {
    users: {
        show: (user) => {
            if (typeof user === "string") {
                return `/users/${user}`;
            } else {
                return `/users/${user.get("slug")}`;
            }
        }
    },

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
