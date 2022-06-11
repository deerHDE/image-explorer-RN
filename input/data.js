let data =
{
    data: [
        {
            name: "bedroom",
            // summary: {
            //     caption: "a bedroom with a bed and a bed",
            //     positionalInformation: ["In the center: bed", "On left bottom corner: chair"],
            //     sizeInformation: ["Large bed", "Medium chair"],
            //     elementsByCategory: ["Bed: 1", "Handbag: 1"],
            //     color: ["Bed: blue", "Wall: white"],
            //     Count: ["Bed: 1", "Books: 3"]
            // },
            summary: [
                {
                    title: "Caption",
                    data: ["a bedroom with a bed and a bed"]
                },
                {
                    title: "Positional Information",
                    data: ["In the center: bed", "On left bottom corner: chair"]
                },
                {
                    title: "Size Information",
                    data: ["Large bed", "Medium chair"]
                },
                {
                    title: "Elements By Category",
                    data: ["Bed: 1", "Handbag: 1"]
                },
                {
                    title: "Color",
                    data:  ["Bed: blue", "Wall: white"]
                },
                {
                    title: "Count",
                    data: ["Bed: 1", "Books: 3"]
                }
            ],
            json: require("./bedroom/bedroom.json"),
            origin: require("./bedroom/origin_bedroom.jpg"),
            maskrcnn: require("./bedroom/maskrcnn_bedroom.png"),
            densecap: require("./bedroom/densecap_maskrcnn_bedroom.png")
        }
    ]
}

export default data