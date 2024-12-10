
import { Injectable } from '@angular/core';
import { Observer, ReplaySubject, Subscription } from 'rxjs';
import { GUID, Guid } from '../utility/guid';


export const EVENTPROVIDERSERVICE_ANY_SUBSCRIBER_GUID: GUID = Guid.createGUID();

export interface IEventProviderNotify {
  eventName: string;
  providerId: GUID;
  subscriberId: GUID;
  context?: any,
  args: any[];
}

export function createEventProviderNotify(event?: Partial<IEventProviderNotify>): IEventProviderNotify {
  const defaultValue: IEventProviderNotify = {
    eventName: "",
    providerId: Guid.createEmpty().toGUID(),
    subscriberId: Guid.createEmpty().toGUID(),
    args: [],
  };  
  return {
      ...defaultValue,
      ...event,
  }
}

interface IEventProvider {
  providerId: GUID;
  dataSubject: ReplaySubject<any>;
  subscriberMap: Map<String, IEventProviderSubscriber>;
  anyProviders: number;
  context?: any,
  lastData?: any[];
}

function createEventProvider(subscriber?: Partial<IEventProvider>): IEventProvider {
  const defaultValue: IEventProvider = {

    providerId: Guid.createEmpty().toGUID(),
    subscriberMap: new Map<String, IEventProviderSubscriber>(),
    dataSubject: new ReplaySubject<any>(1),
    anyProviders: 0,
  };  
  return {
      ...defaultValue,
      ...subscriber,
  }
}

interface IEventProviderSubscriber {
  providerId: GUID;
  subscriberId: GUID;
  eventName: string;
  dataSubject: ReplaySubject<any>;
  parameterData?: any;
}

function createNotifyProviderSubscriber(subscriber?: Partial<IEventProviderSubscriber>): IEventProviderSubscriber {
  const defaultValue: IEventProviderSubscriber = {
    providerId: Guid.createEmptyGUID(),
    subscriberId: Guid.createEmptyGUID(),
    eventName: "",
    dataSubject: new ReplaySubject<any>(1),
    parameterData: {}
  };  
  return {
      ...defaultValue,
      ...subscriber,
  }
}


@Injectable({
providedIn: 'root'
})
export class EventProviderService {
  private providerMap: Map<String, IEventProvider> = new Map<String, IEventProvider>();
  addEvent(providerId: GUID, subscriberId: GUID, eventName: string, parameterData?: any): boolean {
    if (!this.providerMap.has(providerId.toUpperCase())) {
      this.providerMap.set(providerId.toUpperCase(), createEventProvider({
        providerId: providerId,
      }));
    }
    
    const provider: IEventProvider = this.providerMap.get(providerId.toUpperCase()) as IEventProvider;

    if (provider) {

      if (!provider.subscriberMap.has(subscriberId.toUpperCase())) {
        provider.subscriberMap.set(subscriberId.toUpperCase(), createNotifyProviderSubscriber({
            providerId: providerId,
            subscriberId: subscriberId,
            eventName: eventName,
            parameterData: {}
          }));
      }

      const subscriber: IEventProviderSubscriber = provider.subscriberMap.get(subscriberId.toUpperCase()) as IEventProviderSubscriber;
      if (subscriber) {
        return true;
      }
    }
    return false;
  }

  removeEvent(providerId: GUID, subscriberId: GUID): boolean {
    if (this.providerMap.has(providerId.toUpperCase())) {
      const provider: IEventProvider = this.providerMap.get(providerId.toUpperCase()) as IEventProvider;

      if (provider) {

        if (provider.subscriberMap.has(subscriberId.toUpperCase())) {
          return provider.subscriberMap.delete(subscriberId.toUpperCase());
        }
      }
    }
    return false;
  }

  subscribeEvent(providerId: GUID, subscriberId: GUID, observerOrNext?: Partial<Observer<any>> | ((value: any) => void)): Subscription {
    if (this.providerMap.has(providerId.toUpperCase())) {
    
      const provider: IEventProvider = this.providerMap.get(providerId.toUpperCase()) as IEventProvider;

      if (provider) {
        if (subscriberId === EVENTPROVIDERSERVICE_ANY_SUBSCRIBER_GUID) {
          provider.anyProviders++;
          return provider.dataSubject.asObservable().subscribe(observerOrNext);
        } else if (provider.subscriberMap.has(subscriberId.toUpperCase())) {
          const subscriber: IEventProviderSubscriber = provider.subscriberMap.get(subscriberId.toUpperCase()) as IEventProviderSubscriber;
          if (subscriber) {
            return subscriber.dataSubject.asObservable().subscribe(observerOrNext);
          }
        }
      }
    }
    return Subscription.EMPTY;
  }

  fireEvent(eventName: string, providerId: GUID, ...args: any): void {
    const provider: IEventProvider | undefined = this.providerMap.get(providerId.toUpperCase());
    
    if (provider) {
      
      if (provider.anyProviders) {
        const event: IEventProviderNotify = createEventProviderNotify({eventName: eventName, providerId: providerId, args: args});
        provider.dataSubject.next(event);
      } else {
        provider.subscriberMap.forEach((subscriber, key) => {
          const event: IEventProviderNotify = createEventProviderNotify({eventName: eventName, providerId: providerId, subscriberId: subscriber.subscriberId, args: args});
          subscriber.dataSubject.next(event);
        });
      }
    }
  }
}
