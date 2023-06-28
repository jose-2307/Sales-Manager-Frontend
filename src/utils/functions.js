export const formatNumber = (num) => {
    const numStr = num.toString();
    let resp = "";

    let cont = 0;
    for (let i = numStr.length - 1; i >= 0; i --) {
        resp += numStr[i];
        cont ++;
        if (cont === 3) {
            resp += (i - 1) >= 0 ? "." : "";
            cont = 0;
        }

    }
    resp = resp.split("").reverse().join("");
    return resp;
}

export const dateTransform = (date) => {
    const months = [
        {
          name: "Enero",
          number: 1,  
        },
        {
            name: "Febrero",
            number: 2,  
        },
        {
            name: "Marzo",
            number: 3,  
        },
        {
            name: "Abril",
            number: 4,  
        },
        {
            name: "Mayo",
            number: 5,  
        },
        {
            name: "Junio",
            number: 6,  
        },
        {
            name: "Julio",
            number: 7,  
        },
        {
            name: "Agosto",
            number: 8,  
        },
        {
            name: "Septiembre",
            number: 9,  
        },
        {
            name: "Octubre",
            number: 10,  
        },
        {
            name: "Noviembre",
            number: 11,  
        },
        {
            name: "Diciembre",
            number: 12,  
        },
    ];

    let resp;

    const dateSplit = date.split("-");
    resp = dateSplit[2];

    months.forEach(x => {
        if (parseInt(dateSplit[1]) === x.number) {
            resp += ` ${x.name} `
        }
    });
    resp += dateSplit[0];

    return resp;
}