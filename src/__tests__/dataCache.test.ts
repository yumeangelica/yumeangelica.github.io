describe('fetchData', () => {
  let fetchData: typeof import('../dataCache').fetchData

  beforeEach(async () => {
    vi.resetModules()
    const dataCache = await import('../dataCache')
    fetchData = dataCache.fetchData
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('shares the same fetch promise across calls and resolves data', async () => {
    const payload = { message: 'ok' }
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(JSON.stringify(payload), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    const promiseA = fetchData()
    const promiseB = fetchData()

    expect(promiseA).toBe(promiseB)
    expect(fetchMock).toHaveBeenCalledTimes(1)

    const resultA = await promiseA
    const resultB = await promiseB

    expect(resultA).toEqual(payload)
    expect(resultB).toEqual(payload)
  })

  it('retries after a failed fetch and resolves on next call', async () => {
    const payload = { message: 'retry-ok' }
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify(payload), { status: 200 }),
      )
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchData()).rejects.toThrow('HTTP error! status: 500')

    const result = await fetchData()

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(result).toEqual(payload)
  })
})
