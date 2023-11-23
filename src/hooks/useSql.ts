import { querySql } from '@/api/public'
export const useSql = () => {
  const useBlockSql = async (blockId: string) => {
    const res = await querySql(`SELECT * FROM blocks WHERE id = '${blockId}'`)
    return {
      res,
      parentId: res.data[0].parent_id,
      rootId: res.data[0].root_id,
      content: res.data[0].content
    }
  }
  return {
    useBlockSql
  }
}
