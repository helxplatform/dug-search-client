import { useState } from 'react'
import axios from 'axios'

const SEARCH_URL = `${ process.env.REACT_APP_DUG_URL }/search`
const SEARCH_KG_URL = `${ process.env.REACT_APP_DUG_URL }/search_kg`

export const useSearch = () => {
    const [isLoadingResults, setIsLoadingResults] = useState(false)
    const [isLoadingKnowlegeGraphs, setIsLoadingKnowlegeGraphs] = useState(false)
    const [error, setError] = useState(null)
    const [results, setResults] = useState([])
    const [totalItems, setTotalItems] = useState(0)

    const fetchResults = async query => {
        setResults([])
        setIsLoadingResults(true)
        setError(null)
        await axios.post(SEARCH_URL, {
            index: 'test',
            query: query,
            size: 100,
        }).then(response => {
            console.log(response.data)
            const hits = response.data.result.total_items === 0 ? [] : response.data.result.hits.hits.map(r => r._source)
            setResults(hits)
            setTotalItems(hits.length)
            setIsLoadingResults(false)
        }).catch(error => {
            setIsLoadingResults(false)
            console.error(error.message)
            setError('There was an error fetching data')
        })
    }

    const fetchKnowledgeGraphs = async (tag_id, query) => {
        setIsLoadingKnowlegeGraphs(true)
        const knowledgeGraphs = await axios.post(SEARCH_KG_URL, {
            index: 'test_kg',
            unique_id: tag_id,
            query: query,
        }).then(response => {
            console.log(response.data)
            return response.data.result.hits.hits
        })
        .catch(error => {
            console.error(error)
            return []
        })
        setIsLoadingKnowlegeGraphs(false)
        return knowledgeGraphs.map(graph => graph._source.knowledge_graph.knowledge_graph)
    }

    return { isLoadingResults, isLoadingKnowlegeGraphs, error, results, totalItems, fetchResults, fetchKnowledgeGraphs }
}
