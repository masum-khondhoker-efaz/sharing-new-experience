import { JwtPayload } from 'jsonwebtoken';
import prisma from '../../../shared/prisma';
import { ICompany } from './map.interface';

// Function to get companies within a bounding box around the given coordinates
const getCompaniesFromDb = async (latitude: number, longitude: number) => {

    // Fetch all companies from the database, excluding those with null companyName
    const companies = await prisma.company.findMany({
        where: {
            companyName: {
                not: '',
             },
        },
    });

    // Manually filter companies based on proximity (bounding box)
    const nearbyCompanies = companies.filter((company) => {
        const companyLocation = company.location as {
            latitude: number;
            longitude: number;
        };
        // Check if the company is within a bounding box of ±0.1 degrees around the input latitude/longitude
        const distance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
            const toRad = (value: number) => (value * Math.PI) / 180;
            const R = 6371; // Radius of the Earth in km
            const dLat = toRad(lat2 - lat1);
            const dLon = toRad(lon2 - lon1);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c; // Distance in km
        };

        return distance(latitude, longitude, companyLocation.latitude, companyLocation.longitude) <= 200;
    });

    return nearbyCompanies;
};

export const MapServices = {
  getCompaniesFromDb,
};
