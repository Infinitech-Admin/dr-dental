export type Branch = {
    id: string
    name: string
    area: string
    phone: string
    email?: string
    address: string
    hours: string
    mapQuery: string
    directionsUrl: string
    blurb: string
    facebook: string
    instagram?: string
}

// Dr Dental Care Center Branches 
export const BRANCHES: Branch[] = [
    {
        id: "ponciano",
        name: "Ponciano",
        area: "Davao City",
        phone: "+63 967 964 6888",
        email: "dentaldr95@gmail.com",
        address:
            "Unit I-3 K.H Building cor. Ponciano and Bonifacio Street, Davao City, Philippines, 8000",
        hours: "Mon-Fri · 8AM-5PM",
        mapQuery:
            "DR Dental Care Center - Ponciano, Davao City",
        directionsUrl:
            "https://maps.google.com/?q=DR+Dental+Care+Center+Ponciano+Davao+City",
        blurb: "Our Davao City branch located near Ponciano and Bonifacio Street.",
        facebook: "https://www.facebook.com/DrDentalCareCenter/",
        instagram: "https://www.instagram.com/dr.dentalcarecenter/",
    },
    {
        id: "bajada",
        name: "Bajada",
        area: "Davao City",
        phone: "+63 981 381 0999",
        email: "drdentalbajada@gmail.com",
        address:
            "SK Complex, J.P. Laurel Ave, Bajada, Davao City, Philippines, 8000",
        hours: "Mon-Fri · 8AM-5PM",
        mapQuery:
            "DR Dental Care Center - Bajada, SK Complex Davao City",
        directionsUrl:
            "https://maps.google.com/?q=DR+Dental+Care+Center+Bajada+SK+Complex+Davao",
        blurb: "Accessible dental clinic along J.P. Laurel Avenue in Bajada.",
        facebook: "https://www.facebook.com/drdentalcarebajada",
    },
    {
        id: "sm-gensan",
        name: "SM Gensan",
        area: "General Santos City",
        phone: "+63 927 701 7999",
        email: "drdentalgensan@gmail.com",
        address:
            "3rd Floor, SM City General Santos, San Miguel Street Corner Santiago Boulevard, General Santos City, Philippines, 9500",
        hours: "Mon-Fri · 8AM-5PM",
        mapQuery:
            "DR Dental Care Center - SM Gensan, SM City General Santos",
        directionsUrl:
            "https://maps.google.com/?q=DR+Dental+Care+Center+SM+Gensan+SM+City+General+Santos",
        blurb: "Convenient mall-based dental care center inside SM City General Santos.",
        facebook: "https://www.facebook.com/profile.php?id=61581187916792",
    },
    {
        id: "tagum",
        name: "Tagum",
        area: "Tagum City",
        phone: "+63 967 241 6888",
        email: "drdentaltagumbranch@gmail.com",
        address:
            "Cris Inn Hotel Building, Unit Door 22-28, Magugpo East, Lower Apokon, Tagum City, Philippines, 8100",
        hours: "Mon-Fri · 8AM-5PM",
        mapQuery:
            "DR Dental Care Center - Tagum, Cris Inn Hotel Building",
        directionsUrl:
            "https://maps.google.com/?q=DR+Dental+Care+Center+Tagum+Cris+Inn+Hotel",
        blurb: "Serving Tagum City and nearby communities with quality dental services.",
        facebook: "https://www.facebook.com/profile.php?id=61556466363467",
    },
    {
        id: "panabo",
        name: "Panabo",
        area: "Panabo City",
        phone: "+63 928 865 2999",
        email: "drdentalpanabobranch2025@gmail.com",
        address:
            "Ground Floor, Panabo Market Complex, Panabo City, Philippines, 8105",
        hours: "Mon-Fri · 8AM-5PM",
        mapQuery:
            "DR Dental Care Center - Panabo Market Complex",
        directionsUrl:
            "https://maps.google.com/?q=DR+Dental+Care+Center+Panabo+Market+Complex",
        blurb: "Providing dental services to Panabo City and surrounding areas.",
        facebook: "https://www.facebook.com/profile.php?id=61577327366697",
    },
    {
        id: "digos",
        name: "Digos",
        area: "Digos City",
        phone: "+63 918 682 8599",
        email: "",
        address:
            "3rd Floor, Gmall Digos, Tres De Mayo, Upper Digos, Digos City, Philippines, 8002",
        hours: "Mon-Fri · 8AM-5PM",
        mapQuery:
            "DR Dental Care Center - Digos, Gmall Digos",
        directionsUrl:
            "https://maps.google.com/?q=Gmall+Digos",
        blurb: "Our Digos branch bringing accessible dental care to Davao del Sur.",
        facebook: "https://www.facebook.com/profile.php?id=61590649856296",
    },
    {
        id: "toril",
        name: "Toril",
        area: "Davao City",
        phone: "-",
        email: "",
        address:
            "Toril Branch, Davao City, Davao del Sur 8000",
        hours: "Mon-Fri · 8AM-5PM",
        mapQuery:
            "Toril, Davao City",
        directionsUrl:
            "https://maps.google.com/?q=DR+Dental+Care+Center+Toril",
        blurb:
            "Your trusted dental care provider in Toril, Davao City, offering quality and accessible dental services for you and your family.",
        facebook: "",
    },

]

export function getBranchById(id: string): Branch | undefined {
    return BRANCHES.find((b) => b.id === id)
}