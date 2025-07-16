import { ValidationError } from './errors.js'

export const getSqlQueryByData = (data, columns) => {
    if(!data || !columns) {
        throw new ValidationError('Database query generation failed')
    }

    // Проверяем, что все ключи из data есть в разрешенных columns
    const dataKeys = Object.keys(data)
    const invalidKeys = dataKeys.filter(key => !columns.has(key))
    
    if (invalidKeys.length > 0) {
        throw new ValidationError(`Invalid columns provided: ${invalidKeys.join(', ')}`)
    }

    // Проверяем, что есть хотя бы одна валидная колонка
    const validColumns = dataKeys.filter(key => columns.has(key))
    
    if (validColumns.length === 0) {
        throw new ValidationError('No valid columns found in provided data')
    }

    const columnNames = validColumns.join(', ')
    const placeholders = validColumns.map((_, index) => `$${index + 1}`).join(', ')
    const values = validColumns.map(column => data[column])
    
    const sql = `(${columnNames}) VALUES (${placeholders})`
    return { sql, values }
}