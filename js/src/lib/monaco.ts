import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';
import editorWorker from 'monaco-editor/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/language/json/json.worker?worker';

// Bundle Monaco and its workers with Vite instead of loading from a CDN.
self.MonacoEnvironment = {
  getWorker(_workerId, label) {
    return label === 'json' ? new jsonWorker() : new editorWorker();
  },
};

loader.config({ monaco });
