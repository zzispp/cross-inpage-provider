/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { useEffect, useState } from 'react';
import { Console, Hook, Unhook } from 'console-feed';
import { JsBridgeBase } from '@zzispp/cross-inpage-provider-core';
import { isString } from 'lodash';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';

const loggers: Record<string, boolean> = {};

function loadLoggersConfig() {
  if (typeof window === 'undefined') {
    return;
  }
  const config = localStorage.getItem('$$ONEKEY_DEBUG_LOGGER') || '';
  config.split(',').map((name) => {
    name = name ? name.trim() : '';
    if (name) {
      loggers[name] = true;
    }
  });
}

loadLoggersConfig();

export const LogsContainer = ({ bridge }: { bridge?: JsBridgeBase } = {}) => {
  const [logs, setLogs] = useState<any[]>([]);

  // run once!
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Hook(
      window.console,
      (...logs) => {
        setLogs((currLogs) => {
          const newLogs = [...(currLogs || []), ...(logs || [])];
          newLogs.forEach((item) => {
            item.data = (item.data || []).map((content: any, index: number) => {
              try {
                // second console.log params should be string type
                if (index > 0 && !isString(content)) {
                  return JSON.stringify(content);
                }
              } catch (error) {
                // noop
                return `LogsContainer: JSON.stringify error` || 'LogsContainer:  ERROR';
              }
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return
              return content;
            });
          });
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return newLogs;
        });
      },
      false,
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return () => void Unhook(window.console);
  }, []);

  return (
    <div className="bg-black text-white overflow-auto flex flex-col h-full">
      <div className="flex space-x-6 flex-wrap font-size-11 sticky top-0 z-[11] bg-gray-800 p-2">
        <Button variant="destructive" size="sm" onClick={() => setLogs([])}>
          Clear
        </Button>

        {['jsBridge', 'providerBase', 'extInjected'].map((name) => {
          return (
            <div key={name} className="flex items-center space-x-2 min-h-8">
              <label
                htmlFor={name}
                className="p-0 m-0 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {name}
              </label>
              <Checkbox
                id={name}
                defaultChecked={loggers[name]}
                onCheckedChange={(checked) => {
                  // @ts-ignore
                  loggers[name] = Boolean(checked);
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
                  const _bridge = bridge ?? window?.$onekey?.jsBridge ?? window?.hostBridge;
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
                  _bridge?.debugLogger?._debug?.enable(
                    Object.entries(loggers)
                      .map(([k, v]) => (v ? k : null))
                      .filter(Boolean)
                      .join(','),
                  );
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="flex-grow z-10">
        <Console logs={logs} variant="dark" />
      </div>
    </div>
  );
};
