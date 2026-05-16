describe('fetchData', () => {
  let fetchData

  beforeEach(async () => {
    vi.resetModules()
      ; ({ fetchData } = await import('../dataCache'))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shares the same fetch promise across calls and resolves data', async () => {
    const payload = { message: 'ok' }
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(payload)
      })
    )

    const promiseA = fetchData()
    const promiseB = fetchData()

    expect(promiseA).toBe(promiseB)
    expect(global.fetch).toHaveBeenCalledTimes(1)

    const resultA = await promiseA
    const resultB = await promiseB

    expect(resultA).toEqual(payload)
    expect(resultB).toEqual(payload)
  })

  it('retries after a failed fetch and resolves on next call', async () => {
    const payload = { message: 'retry-ok' }
    global.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(payload)
      })

    await expect(fetchData()).rejects.toThrow('HTTP error! status: 500')

    const result = await fetchData()

    expect(global.fetch).toHaveBeenCalledTimes(2)
    expect(result).toEqual(payload)
  })
})
