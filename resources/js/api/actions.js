import instance from './instance'

export const fetchUrlPreview = url => {
    return instance.get('preview', {
        params: { url }
    })
}
