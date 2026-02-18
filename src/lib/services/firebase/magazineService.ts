class MagazineService {
  async getMagazineContent(): Promise<any> {
    return null
  }
}

// Export singleton instance
const magazineService = new MagazineService();
export default magazineService;
