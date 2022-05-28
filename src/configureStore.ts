import { createStore } from 'redux'
import { createMigrate, MigrationManifest, PersistConfig, PersistedState, persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import modules, { RootState } from './modules'

type Migrations = Record<string, (state: RootState & PersistedState) => unknown>

const migrations: Migrations = {
}

const persistConfig: PersistConfig<RootState> = {
  key: 'mh-rise',
  storage,
  whitelist: ['skillLog', 'charms', 'ignoreArmors', 'decoLimits'],
  migrate: createMigrate(migrations as MigrationManifest),
  version: 0,
}

const persistedReducer = persistReducer(persistConfig, modules)

export const store = createStore(persistedReducer)
export const persistor = persistStore(store)
