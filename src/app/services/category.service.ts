import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  where,
  DocumentReference,
  deleteDoc,
} from '@angular/fire/firestore';
import { CollectionReference, query } from '@firebase/firestore';
import { CategoryInterface } from '../models/category.interface';
import { from } from 'rxjs';
import { user } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private firestore: Firestore = inject(Firestore);
  private categoriesCollection: CollectionReference<CategoryInterface> =
    collection(
      this.firestore,
      'categories'
    ) as CollectionReference<CategoryInterface>;

  db = getFirestore();

  constructor() {}

  async getUserCategories(userId: string) {
    const categoryCollection = collection(this.db, 'categories');

    const q = query(categoryCollection, where('userId', '==', userId));

    const querySnapshot = await getDocs(q);

    const categories: CategoryInterface[] = [];

    querySnapshot.forEach((category) => {
      const data = category.data();

      categories.push({
        categoryId: category.id,
        userId: data['userId'],
        name: data['name'],
        type: data['type'],
      });
    });

    return categories;
  }

  async getCategoryById(categoryId: string) {
    const categoryCollection = collection(this.db, 'categories');
    // const q = query(categoryCollection, where('categoryId', '==', categoryId));

    const docRef = doc(this.db, 'categories', categoryId);

    const querySnapshot = await getDoc(docRef);

    const data = querySnapshot.data();

    const category: CategoryInterface = {
      categoryId: data!['categoryId'],
      name: data!['name'],
      type: data!['type'],
      userId: data!['userId'],
    };

    return category;
  }

  saveCategory(name: string, type: string, userId: string) {
    
    const docRef: DocumentReference<CategoryInterface> = doc(
      this.categoriesCollection
    );
    const newId = docRef.id;
    const newCategory: CategoryInterface = {
      categoryId: newId,
      name: name,
      type: type,
      userId: userId,
    };

    const promise = setDoc(docRef, newCategory);

    return from(promise);
  }

  updateCategory(
    categoryId: string,
    name: string,
    type: string,
    userId: string
  ) {
    const referenceOfDoc = doc(this.db, 'categories', categoryId);
    const categoryData: CategoryInterface = {
      categoryId: categoryId,
      name: name,
      type: type,
      userId: userId,
    };

    const promise = setDoc(referenceOfDoc, categoryData);

    return from(promise);
  }

  deleteCategory(categoryId:string){
    const promise =  deleteDoc(doc(this.db, "categories", categoryId));
    return from(promise)
  }
}
