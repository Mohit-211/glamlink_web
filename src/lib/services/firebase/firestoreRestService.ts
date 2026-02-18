// Firestore REST API Service
// This bypasses authentication requirements by using the REST API directly

const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/databases/(default)/documents`;

class FirestoreRestService {
  private apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  private convertToFirestoreValue(value: any): any {
    if (value === null) return { nullValue: null };
    if (typeof value === 'boolean') return { booleanValue: value };
    if (typeof value === 'number') {
      if (Number.isInteger(value)) return { integerValue: value.toString() };
      return { doubleValue: value };
    }
    if (typeof value === 'string') return { stringValue: value };
    if (value instanceof Date) return { timestampValue: value.toISOString() };
    if (Array.isArray(value)) {
      return {
        arrayValue: {
          values: value.map(v => this.convertToFirestoreValue(v))
        }
      };
    }
    if (typeof value === 'object') {
      const fields: any = {};
      for (const [key, val] of Object.entries(value)) {
        fields[key] = this.convertToFirestoreValue(val);
      }
      return { mapValue: { fields } };
    }
    return { stringValue: String(value) };
  }

  private convertFromFirestoreValue(value: any): any {
    if (value.nullValue !== undefined) return null;
    if (value.booleanValue !== undefined) return value.booleanValue;
    if (value.integerValue !== undefined) return parseInt(value.integerValue);
    if (value.doubleValue !== undefined) return value.doubleValue;
    if (value.stringValue !== undefined) return value.stringValue;
    if (value.timestampValue !== undefined) return new Date(value.timestampValue);
    if (value.arrayValue !== undefined) {
      return value.arrayValue.values?.map((v: any) => this.convertFromFirestoreValue(v)) || [];
    }
    if (value.mapValue !== undefined) {
      const result: any = {};
      if (value.mapValue.fields) {
        for (const [key, val] of Object.entries(value.mapValue.fields)) {
          result[key] = this.convertFromFirestoreValue(val);
        }
      }
      return result;
    }
    return null;
  }

  async setDocument(
    collectionName: string,
    documentId: string,
    data: any,
    merge: boolean = true
  ): Promise<void> {
    // Use simple PUT request for create-or-replace (avoids updateMask issues)
    const url = `${FIRESTORE_BASE_URL}/${collectionName}/${documentId}?key=${this.apiKey}`;
    
    const fields: any = {};
    for (const [key, value] of Object.entries(data)) {
      fields[key] = this.convertToFirestoreValue(value);
    }
    
    // Add timestamp
    fields.updatedAt = this.convertToFirestoreValue(new Date().toISOString());
    
    const body = {
      fields,
      name: `projects/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/databases/(default)/documents/${collectionName}/${documentId}`
    };

    // Setting document
    
    try {
      // Use PUT for create-or-replace operation
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const error = await response.text();
        // Error response from Firestore REST API
        throw new Error(`Firestore REST API error: ${response.status} ${response.statusText}`);
      }

      // Document set successfully
    } catch (error) {
      // Error setting document
      throw error;
    }
  }

  async getDocument(collectionName: string, documentId: string): Promise<any> {
    const url = `${FIRESTORE_BASE_URL}/${collectionName}/${documentId}?key=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      
      if (response.status === 404) {
        // Document not found
        return null;
      }

      if (!response.ok) {
        throw new Error(`Firestore REST API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Convert Firestore format to regular object
      const result: any = { id: documentId };
      if (data.fields) {
        for (const [key, value] of Object.entries(data.fields)) {
          result[key] = this.convertFromFirestoreValue(value);
        }
      }
      
      // Document found
      return result;
    } catch (error) {
      // Error getting document
      return null;
    }
  }
}

export default new FirestoreRestService();