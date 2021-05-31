import React, { useState } from 'react'
import { fetchUrlPreview } from '../api/actions'

import Button from './Button.jsx'
import Input from './Input.jsx'

const URL_REGEXP = new RegExp('^(https?:\\/\\/)?'+     // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+            // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+          // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+             // query string
  '(\\#[-a-z\\d_]*)?$','i');              // fragment locator

const UrlPreview = ({ url }) => {
  return <a href={ url.url } target="_blank" rel="noopener noreferrer" className="p-4 rounded-lg bg-gray-700 block hover:bg-gray-600 duration-100 animate-colors">
    { url.title && <h2 className="text-xl font-bold truncate mb-3 font-serif tracking-wide" title={ url.title }>{ url.title }</h2> }
    <div className="relative">
      <img src={ url.screenshot } alt={ `Preview of ${url.url}` } className="rounded"/>
      { url.type &&
        <span className="absolute top-0 left-0 mt-4 ml-4 p-2 text-xs uppercase rounded bg-gray-600">{ url.type }</span>
      }
      <span className="absolute bottom-0 left-0 mb-4 ml-4 p-2 text-xs rounded bg-black">{ url.url }</span>
    </div>
    { url.description &&
      <p className="mt-2">{ url.description }</p>
    }
  </a>
}

const UrlPreviewer = props => {
  const [areaText, setAreaText] = useState("")
  const [fetching, setFetching] = useState(false)
  const [urls, setUrls] = useState([])
  const [error, setError] = useState()

  const handleSubmit = event => {
    event.preventDefault()

    setError()
    setFetching(true)

    const data = new FormData(event.target)
    const potentialUrl = data.get('url')

    if (!URL_REGEXP.test(potentialUrl)) {
      setError("That doesn't seem like an URL, please double-check 🙏")
      setFetching(false)
      return
    }

    if (urls.some(url => (url.url === potentialUrl))) {
      setError("That one's already checked, look down there! 👇")
      setFetching(false)
      return
    }

    fetchUrlPreview(potentialUrl).then(response => {
      setUrls(old => [response.data, ...old])
      event.target.reset()
    }).catch(error => {
      console.error(error)
      setError(error.message ? error.message : "There was an error checking that URL. Please contact me so I can look into it!")
    }).finally(() => {
      setFetching(false)
    })
  }

  return <div className="container px-4 py-24">
    <div className="bg-gray-800 text-white mx-auto p-4 rounded-xl w-full md:w-1/2">
      <div className="flex flex-col gap-4">
        <h1 className="text-6xl tracking-wide font-serif font-bold text-center">URL Previewer</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 justify-between">
          <Input placeholder="Enter a valid URL" type="url" name="url" className="flex-grow-1 w-full" required disabled={fetching}/>
          <Button type="submit" className="flex-grow-1 w-full" disabled={fetching}>{fetching ? "Getting" : "Get"} preview</Button>
        </form>

        { error && <p className="text-red-500">{ error }</p> }

        { fetching && <div className="bg-gray-700 animate-pulse w-full rounded-lg pb-48"/> }

        { urls.length > 0 &&
          <div className="flex flex-col gap-4">
            { urls.map(url => <UrlPreview key={url.url} url={url}/>) }
          </div>
        }
      </div>
    </div>
  </div>
}

export default UrlPreviewer
