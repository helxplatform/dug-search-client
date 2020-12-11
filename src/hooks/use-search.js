import { useState } from 'react'
import axios from 'axios'

const SEARCH_URL = `${ process.env.REACT_APP_DUG_URL }/search`
const SEARCH_KG_URL = `${ process.env.REACT_APP_DUG_URL }/search_kg`
const SEARCH_VAR_URL = `${ process.env.REACT_APP_DUG_URL }/search_var`

export const useSearch = () => {
    const [isLoadingResults, setIsLoadingResults] = useState(false)
    const [isLoadingKnowlegeGraphs, setIsLoadingKnowlegeGraphs] = useState(false)
    const [isLoadingVariables, setIsLoadingVariables] = useState(false)
    const [error, setError] = useState(null)
    const [results, setResults] = useState([])
    const [totalItems, setTotalItems] = useState(0)

    const fetchResults = async query => {
        setResults([])
        setIsLoadingResults(true)
        setError(null)
        await axios.post(SEARCH_URL, {
            index: 'concepts_index',
            query: query,
            size: 1000,
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

    const fetchKnowledgeGraphs = async (concept_id, query) => {
        setIsLoadingKnowlegeGraphs(true)
        const knowledgeGraphs = await axios.post(SEARCH_KG_URL, {
            index: 'kg_index',
            unique_id: concept_id,
            query: query,
            size: 100,
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
    // This is a guess at what this function is supposed to be - JBC 29 NOV 2020
    const fetchVariableResults = async (concept_id, query) => {
        console.log(query)
        setIsLoadingVariables(true)
        const variables = await axios.post(SEARCH_VAR_URL, {
            index: 'variables_index',
            concept: concept_id,
            query: query,
            size: 1000,
        }).then(response => {
            console.log(response.data)
            var res = response.data.result.hits.hits

            console.log(res)
            return res
        })
        .catch(error => {
            console.error(error)
            return []
        })
        setIsLoadingVariables(false)
        return variables.map(variables => variables._source)
    }

    return { isLoadingResults, isLoadingKnowlegeGraphs, isLoadingVariables, error, results, totalItems, fetchResults, fetchKnowledgeGraphs, fetchVariableResults }
}
