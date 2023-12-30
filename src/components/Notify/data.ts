/*
 * @Author: 王大旭
 * @Date: 2023-04-24 15:46:56
 * @LastEditors: 王大旭
 * @LastEditTime: 2023-04-24 17:31:36
 * @Description:
 */
export interface IListItem {
  avatar?: string
  title: string
  datetime?: string
  description?: string
  status?: "" | "success" | "info" | "warning" | "danger"
  extra?: string
}

export const notifyData: IListItem[] = [
  {
    avatar: "",
    title: "",
    datetime: "",
    description: " "
  }
]

export const messageData: IListItem[] = [
  {
    avatar: "",
    title: "",
    description: "",
    datetime: ""
  }
]

export const todoData: IListItem[] = [
  {
    title: "",
    description: "",
    extra: "",
    status: ""
  }
]
