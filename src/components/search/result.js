import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useSearch } from '../../hooks'
import { Subheading, Paragraph } from '../typography'
import { Collapser } from '../collapser'
import { KnowledgeGraphs } from '../search'
import { VariablesList } from './study-variables-list'
import { dbGapLink } from '../../utils'
import { ExternalLink } from '../external-link'

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
    &:not(:last-child) {
        border-bottom: 1px solid var(--color-eggplant-light);
    }
`

// Name

const Name = styled(Subheading)`
    padding: 1rem;
    margin: 0;
`

// Details

const ResultParagraph = styled(Paragraph)`
    margin: 1rem;
`

const ConceptType = styled(Paragraph)`
    margin: 1rem;
`

const ConceptDescription = styled(Paragraph)`
    margin: 1rem;
`

const collapserStyles = {
    titleStyle: {
        backgroundColor: '#eee',
        borderWidth: '1px 0',
        borderStyle: 'solid',
        borderColor: 'var(--color-lightgrey)',
    },
    bodyStyle: {
        backgroundColor: '#ddd',
    },
}

const CollapserHeader = styled.div`
    display: flex;
    flex-direction: column;
    @media (min-width: 920px) {
        flex-direction: row;
    }
    justify-content: space-between;
    padding: 0.5rem 1rem;
`


const StudyName = styled.div``
const StudyAccession = styled.div``

export const Result = ({ result, query }) => {
    const { name, description, id, type } = result // other properties: type, search_terms, optional_terms
    const [knowledgeGraphs, setKnowledgeGraphs] = useState([])
    const [variableResults, setVariableResults] = useState([])
    const { fetchKnowledgeGraphs } = useSearch()
    const { fetchVariableResults } = useSearch()
    const noURLTerms = ["TOPMED", "PATO", "ZFA", "VT", "SO", "IAO", "OBO", "WBbt", "FBbt", "BFO"]

    useEffect(() => {
        const getKgs = async () => {
            const kgs = await fetchKnowledgeGraphs(id, query)
            setKnowledgeGraphs(kgs)
        }
        getKgs()
        const getVars = async () => {
            const vars = await fetchVariableResults(id, query)
            //console.log(vars)
            var groupedIds = vars.reduce((acc, obj) => {
                let key = obj["study_id"]
                if (!acc[key]) {
                    acc[key] = []
                }
                acc[key].push({
                    id: obj.id,
                    name: obj.name,
                    description: obj.description
                })
                return acc
            }, {})
            var res = []
            vars.reduce((thing, current) => {
                const x = thing.find(item => item.study_id === current.study_id);
                if (!x) {
                    var cid = current.study_id
                    var variableIds = groupedIds[cid]

                    var studyObj = {
                        study_id: current.study_id,
                        study_name: current.study_name,
                        variables: variableIds
                    }

                    res.push(studyObj)
                    return thing.concat([current]);
                } else {
                    return thing;
                }
            }, []);
            console.log(res)
            setVariableResults(res)
        }
        getVars()
    }, [])

    return (
        <Wrapper>
            { !noURLTerms.map((term) => id.includes(term)).includes(true) ? (
                <Name>Concept: <ExternalLink to={`http://purl.obolibrary.org/obo/` + id.replace(/:/, '_')} >{name}</ExternalLink></Name>
            ) : (
                <Name>Concept: {name}</Name>   
            )}
            { 
                <ResultParagraph>
                    {type !== "" ? (
                        <ConceptType>
                            <strong>Type</strong>: { type } <br></br>
                        </ConceptType>
                    ) : (
                        <ConceptType>
                            <strong>Type</strong>: Untyped <br></br>
                        </ConceptType>
                    )}
                    {description !== "" ? (
                        <ConceptDescription>
                            <strong>Description</strong>: { description } <br></br>
                        </ConceptDescription>
                    ) : (
                        <ConceptDescription>
                            <strong>Description</strong>: No description for this concept. <br></br>
                        </ConceptDescription>
                    )}
                </ResultParagraph>
            }
            {
                variableResults.length > 0 && variableResults.map(({ study_id, study_name, variables }) =>(
                    <Collapser key={`${name} ${study_id}`} ariaId={'studies'} {...collapserStyles}
                        title={
                            <CollapserHeader>
                                <StudyName>
                                    <strong>Study</strong>:
                                    <ExternalLink to={dbGapLink.study(study_id.replace(/^TOPMED\.STUDY:/, ''))} >{study_name}</ExternalLink>
                                </StudyName>
                                <StudyAccession>
                                    <strong>Accession</strong>:
                                    <ExternalLink to={dbGapLink.study(study_id.replace(/^TOPMED\.STUDY:/, ''))} >{study_id.replace(/^TOPMED\.STUDY:/, '')}</ExternalLink>
                                </StudyAccession>
                            </CollapserHeader>
                        }
                    >
                        <VariablesList studyId={study_id.replace(/^TOPMED\.STUDY:/, '')} variables={variables} />
                    </Collapser>
                ))
            }
            {
                knowledgeGraphs.length > 0 && (
                    <Collapser key={`${name} kg`} ariaId={`${name} kg`} {...collapserStyles} title={<CollapserHeader>Knowledge Graph</CollapserHeader>}>
                        <KnowledgeGraphs graphs={knowledgeGraphs} />
                    </Collapser>
                )
            }
        </Wrapper>
    )
}

Result.propTypes = {
    result: PropTypes.shape({
        id:PropTypes.string.isRequired,
        name:PropTypes.string.isRequired,
        description:PropTypes.string.isRequired,
        type:PropTypes.string.isRequired,
        search_terms:PropTypes.array.isRequired,
        optional_terms:PropTypes.array.isRequired
    })
}

/*
            {
                knowledgeGraphs.length > 0 && (
                    <Collapser key={ `${ name } kg` } ariaId={ `${ name } kg` } { ...collapserStyles } title={ <CollapserHeader>Knowledge Graph</CollapserHeader> }>
                        <KnowledgeGraphs graphs={ knowledgeGraphs } />
                    </Collapser>
                )
            }
Section I had to take out because variables didn't work
            {
                variableResults.studies.map(({ study_id, study_name, variables }) => (
                    <Collapser key={ `${ name } ${ study_id }` } ariaId={ 'studies' } { ...collapserStyles }
                        title={
                            <CollapserHeader>
                                <StudyName>
                                    <strong>Study</strong>:
                                    <ExternalLink to={ dbGapLink.study(study_id.replace(/^TOPMED\.STUDY:/, '')) } >{ study_name }</ExternalLink>
                                </StudyName>
                                <StudyAccession>
                                    <strong>Accession</strong>: 
                                    <ExternalLink to={ dbGapLink.study(study_id.replace(/^TOPMED\.STUDY:/, '')) } >{ study_id.replace(/^TOPMED\.STUDY:/, '') }</ExternalLink>
                                </StudyAccession>
                            </CollapserHeader>
                        }
                    >
                        <VariablesList studyId={ study_id.replace(/^TOPMED\.STUDY:/, '') } variables={ variables } />
                    </Collapser>
                ))
            }
*/