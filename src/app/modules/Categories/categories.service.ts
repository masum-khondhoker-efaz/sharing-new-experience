import { JwtPayload } from 'jsonwebtoken';
import prisma from '../../../shared/prisma';
import { ICategory, ISubcategory } from './categories.interface';


// create category
const createCategoryIntoDb = async (user: JwtPayload, payload: ICategory) => {
  const category = await prisma.category.create({
    data: { ...payload,
      userId: user.id
    },
  });
  return category;
};

// get category
const getCategoryFromDb = async () => {
  const category = await prisma.category.findMany();
  return category;
};

// update category
const updateCategoryIntoDb = async (user : JwtPayload, payload: ICategory, categoryId: string) => {
  const category = await prisma.category.update({
    where: {
      userId: user.id,
      id: categoryId,
    },
    data: {
      ...payload
    },
  });
  return category;
};

// delete category
const deleteCategoryFromDb = async (user: JwtPayload, categoryId: string) =>
{
  const category = await prisma.category.delete({
    where: {
      id: categoryId,
      userId: user.id,
    },
  });
  return category;
}

// create subcategory
const createSubcategoryIntoDb = async (user: JwtPayload, payload: ISubcategory, categoryId: string) => {
  
  const subcategory = await prisma.subcategory.create({
    data: {
      ...payload,
      userId: user.id,
      categoryId: categoryId
    },
  });
  return subcategory;
};

// get subcategory
const getSubcategoryFromDb = async (user: JwtPayload) => {
  const subcategory = await prisma.subcategory.findMany();
  return subcategory;
};

// update subcategory
const updateSubcategoryIntoDb = async (user: JwtPayload, payload: ISubcategory, subcategoryId: string) => {
  const subcategory = await prisma.subcategory.update({
    where: {
      id: subcategoryId,
      userId: user.id,
    },
    data: {
      ...payload,
    },
  });
  return subcategory;
};

// delete subcategory
const deleteSubcategoryFromDb = async (user: JwtPayload,subcategoryId: string) =>
{
  const subcategory = await prisma.subcategory.delete({
    where: {
      id: subcategoryId,
      userId: user.id,
    },
  });
  return subcategory;
}

export const CategoriesServices = {
  createCategoryIntoDb,
  getCategoryFromDb,
  updateCategoryIntoDb,
  deleteCategoryFromDb,
  createSubcategoryIntoDb,
  getSubcategoryFromDb,
  updateSubcategoryIntoDb,
  deleteSubcategoryFromDb,
};
