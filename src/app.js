import React, { Fragment, useEffect, useState } from 'react'
import { Main } from './components/main'
import { Title, Heading, Paragraph } from './components/typography'
import {
    PaginationTray, Result, SearchForm, ResultsCount,
    ResultsCard, ResultsCardHeader, ResultsCardBody, ResultsCardFooter, ResultsCardTitle
} from './components/search'
import { LoadingDots } from './components/loading-dots'
import { Alert } from './components/alert'
import { useSearch } from './hooks'
import { IconButton } from './components/buttons'
import { ChevronLeftIcon, ChevronRightIcon, FirstPageIcon, LastPageIcon } from './components/icons'
import asciiLogo from './logo'

const App = () => {
    const [query, setQuery] = useState('')
    const [resultIndex, setResultIndex] = useState(0)
    const [searchedQuery, setSearchedQuery] = useState('')
    const { isLoadingResults, error, results, totalItems, fetchResults } = useSearch()

    useEffect(() => console.log(asciiLogo), [])

    const doSearch = () => {
        fetchResults(query)
        setSearchedQuery(query)
        setResultIndex(0)
    }

    const goToResult = newIndex => () => {
        setResultIndex(newIndex)
    }

    const handleChangeQuery = event => setQuery(event.target.value)
    const handleSubmit = event => doSearch()
    const handleKeyDown = event => { if (event.keyCode === 13) doSearch() }

    const goToFirstResult = event => { setResultIndex(0) }
    const goToPreviousResult = event => { setResultIndex(resultIndex => resultIndex - 1) }
    const goToNextResult = event => { setResultIndex(resultIndex => resultIndex + 1) }
    const goToLastResult = event => { setResultIndex(totalItems - 1) }

    return (
        <Main>
            <Title>Semantic Search</Title>
            
            <br/><br/>
 
            <section>
                <SearchForm
                    value={ query }
                    placeholder="Enter query"
                    changeHandler={ handleChangeQuery }
                    submitHandler={ handleSubmit }
                    keyDownHandler={ handleKeyDown }
                />
                
                <br/><br/>

                {
                    searchedQuery && (
                        <Fragment>
                            { totalItems >= 1 && <Heading center>{ totalItems } Concept(s) found for "{ searchedQuery }"</Heading> }
                            <ResultsCard>
                                <ResultsCardHeader>
                                    { totalItems > 1 && <IconButton disabled={ resultIndex === 0 } onClick={ goToFirstResult }><FirstPageIcon fill="#fff" size={ 24 } /></IconButton> }
                                    { totalItems > 1 && <IconButton disabled={ resultIndex === 0 } onClick={ goToPreviousResult }><ChevronLeftIcon fill="#fff" size={ 24 } /></IconButton> }
                                    { totalItems > 1 && <ResultsCardTitle>Result { resultIndex + 1 } of { totalItems }</ResultsCardTitle> }
                                    { totalItems > 1 && <IconButton disabled={ resultIndex === totalItems - 1} onClick={ goToNextResult }><ChevronRightIcon fill="#fff" size={ 24 } /></IconButton> }
                                    { totalItems > 1 && <IconButton disabled={ resultIndex === totalItems - 1 } onClick={ goToLastResult }><LastPageIcon fill="#fff" size={ 24 } /></IconButton> }
                                </ResultsCardHeader>
                                <Fragment>
                                    { error && <Alert type="error" message={ error } /> }
                                    { !error && isLoadingResults && <LoadingDots color="var(--color-crimson)" text="Searching..." textPlacement="top" /> }
                                    { !error && !isLoadingResults && results.length > 0 && <Result key={ resultIndex } query={ query } result={ results[resultIndex] } /> }
                                    { !error && !isLoadingResults && results.length === 0 && <ResultsCardBody><Paragraph center>No results to display</Paragraph></ResultsCardBody> }
                                </Fragment>
                                <ResultsCardFooter>
                                    { totalItems > 1 && <IconButton disabled={ resultIndex === 0 } onClick={ goToFirstResult }><FirstPageIcon fill="#fff" size={ 24 } /></IconButton> }
                                    { totalItems > 1 && <IconButton disabled={ resultIndex === 0 } onClick={ goToPreviousResult }><ChevronLeftIcon fill="#fff" size={ 24 } /></IconButton> }
                                    { totalItems > 0 && <ResultsCount>Result { resultIndex + 1 } of { totalItems }</ResultsCount> }
                                    { totalItems > 1 && <IconButton disabled={ resultIndex === totalItems - 1} onClick={ goToNextResult }><ChevronRightIcon fill="#fff" size={ 24 } /></IconButton> }
                                    { totalItems > 1 && <IconButton disabled={ resultIndex === totalItems - 1 } onClick={ goToLastResult }><LastPageIcon fill="#fff" size={ 24 } /></IconButton> }
                                </ResultsCardFooter>
                            </ResultsCard>
                        </Fragment>
                    )
                }

                {
                    totalItems > 1 && (
                        <PaginationTray
                            links={ [...Array(totalItems).keys()].map(i => goToResult(i)) }
                            currentPage={ resultIndex }
                            prevPageHandler={ resultIndex === 0 ? null : goToPreviousResult }
                            nextPageHandler={ resultIndex < totalItems - 1 ? goToNextResult : null }
                            firstPageHandler={ resultIndex === 0 ? null : goToFirstResult }
                            lastPageHandler={ resultIndex < totalItems - 1 ? goToLastResult : null }
                        />
                    )
                }

            </section>
        </Main>
    )
}

export default App