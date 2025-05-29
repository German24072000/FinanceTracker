import { inject, Injectable } from '@angular/core';
import {
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
import {
  CollectionReference,
  FirestoreDataConverter,
  query,
} from '@firebase/firestore';
import { CategoryInterface } from '../models/category.interface';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private firestore: Firestore = inject(Firestore);
  db = getFirestore();

  categoryConverter: FirestoreDataConverter<CategoryInterface> = {
    toFirestore: (category: CategoryInterface) => {
      // const {...data} = category
      // return data
      return {
        categoryId: category.categoryId,
        name: category.name,
        type: category.type,
        userId: category.userId,
      };
    },
    fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options)!;
      return {
        categoryId: data['categoryId'],
        name: data['name'],
        type: data['type'],
        userId: data['username'],
      } as CategoryInterface;
    },
  };

  constructor() {}

  getCategoryCollectionForUser(
    userId: string
  ): CollectionReference<CategoryInterface> {
    return collection(
      doc(this.db, 'users', userId),
      'categories'
    ).withConverter(this.categoryConverter);
  }

  async getUserCategories(userId: string){
    const categoryCollection = this.getCategoryCollectionForUser(userId);
    const q = query(categoryCollection, where('userId', '==', userId))
    const querySnapshot = await getDocs(q)

    const categories: CategoryInterface[] = []

    querySnapshot.forEach((category) =>{
      const data = category.data();

      categories.push({
        categoryId: data['categoryId'],
        name: data['name'],
        type: data['type'],
        userId: data['userId'],
      });
    });

    return categories
  }

  async getCategoryById(userId:string, categoryId: string) {
    const categoryCollection = this.getCategoryCollectionForUser(userId);
    
    const docRef = doc(categoryCollection, categoryId);
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
    const categoryCollection = this.getCategoryCollectionForUser(userId);

    //Option 1
    const docRef = doc(categoryCollection)

    //Option 2
    // const docRef: DocumentReference<CategoryInterface> =
    //   doc(categoryCollection);

    const newId = docRef.id;

    const categoryToSave: CategoryInterface = {
      categoryId: newId,
      name: name,
      type: type,
      userId: userId,
    };

    const promise = setDoc(docRef, categoryToSave);
    return from(promise)
  }

  updateCategory(
    categoryId: string,
    name: string,
    type: string,
    userId: string
  ) {
    // const referenceOfDoc = doc(this.db, 'categories', categoryId);
    const categoryCollection = this.getCategoryCollectionForUser(userId);
    const docRef = doc(categoryCollection,categoryId);

    const categoryData: CategoryInterface = {
      categoryId: categoryId,
      name: name,
      type: type,
      userId: userId,
    };

    const promise = setDoc(docRef, categoryData);
    return from(promise);
  }

  deleteCategory(userId:string,categoryId: string) {
    const categoryCollection = this.getCategoryCollectionForUser(userId);
    //const promise = deleteDoc(doc(this.db, 'categories', categoryId));
    const promise = deleteDoc(doc(categoryCollection, categoryId))
    return from(promise);
  }
}
