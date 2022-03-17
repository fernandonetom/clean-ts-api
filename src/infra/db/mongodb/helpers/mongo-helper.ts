import { Collection, MongoClient, ObjectId } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,
  url: null as unknown as string,
  async connect (url: string): Promise<void> {
    this.client = await MongoClient.connect(url)
    this.url = url
  },
  async disconnect (): Promise<void> {
    if (this.client) {
      this.client.close()
    }
    this.client = null
  },
  async getCollection (name: string): Promise<Collection> {
    if (!this.client) {
      await this.connect(this.url)
    }
    return this.client.db().collection(name)
  },
  map (data: any): any {
    const { _id, ...rest } = data
    return { ...rest, id: _id.toHexString() }
  },
  ObjectId (id: string): ObjectId {
    return new ObjectId(id)
  }
}
