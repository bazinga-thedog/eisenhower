import * as React from 'react'
import { Avatar } from '@fluentui/react-components'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ToDo } from './types/todo'

type ImageAvatarProps = {
  name: string
  ulr: string
}

export default function ImageAvatar(props: Partial<ImageAvatarProps>) {
  const [data, setData] = useState<ToDo[]>([])

  const { id } = useParams()

  useEffect(() => {
    console.log('ImageAvatar mounted')
    console.log('id', id)
    fetch('http://localhost:3030/api/task')
      .then(response => response.json())
      .then((data: ToDo[]) => {
        setData(data)
        console.log(data)
      })
      .catch(error => console.error('Error fetching data:', error))
  }, [])

  return (
    <div>
      <Avatar
        name={props.name}
        image={{
          src: 'https://fabricweb.azureedge.net/fabric-website/assets/images/avatar/KatriAthokas.jpg',
        }}
      />
      <span>{props.name}</span>
      <ul className="list-disc pl-5">
        {data.map((item, index) => (
          <li key={index}>
            {item.id} - {item.description}
          </li>
        ))}
      </ul>
    </div>
  )
}
