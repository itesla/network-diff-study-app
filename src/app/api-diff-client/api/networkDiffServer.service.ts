/**
 * Network diff service API
 * This is the documentation of network diff service REST API
 *
 * OpenAPI spec version: 1.0.0
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *//* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent }                           from '@angular/common/http';
import { CustomHttpUrlEncodingCodec }                        from '../encoder';

import { Observable }                                        from 'rxjs';


import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class NetworkDiffServerService {

    protected basePath = '';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
            this.basePath = basePath || configuration.basePath || this.basePath;
        }
    }

    /**
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
    private canConsumeForm(consumes: string[]): boolean {
        const form = 'multipart/form-data';
        for (const consume of consumes) {
            if (form === consume) {
                return true;
            }
        }
        return false;
    }


    /**
     * compare two networks voltage levels, with thresholds for current and voltage
     *
     * @param epsilon Epsilon
     * @param network1Uuid Network1 UUID
     * @param network2Uuid Network2 UUID
     * @param vlId Voltage level ID
     * @param voltageEpsilon Voltage Epsilon
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public diffNetworksUsingGET(epsilon: number, network1Uuid: string, network2Uuid: string, vlId: string, voltageEpsilon: number, observe?: 'body', reportProgress?: boolean): Observable<string>;
    public diffNetworksUsingGET(epsilon: number, network1Uuid: string, network2Uuid: string, vlId: string, voltageEpsilon: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
    public diffNetworksUsingGET(epsilon: number, network1Uuid: string, network2Uuid: string, vlId: string, voltageEpsilon: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
    public diffNetworksUsingGET(epsilon: number, network1Uuid: string, network2Uuid: string, vlId: string, voltageEpsilon: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (epsilon === null || epsilon === undefined) {
            throw new Error('Required parameter epsilon was null or undefined when calling diffNetworksUsingGET.');
        }

        if (network1Uuid === null || network1Uuid === undefined) {
            throw new Error('Required parameter network1Uuid was null or undefined when calling diffNetworksUsingGET.');
        }

        if (network2Uuid === null || network2Uuid === undefined) {
            throw new Error('Required parameter network2Uuid was null or undefined when calling diffNetworksUsingGET.');
        }

        if (vlId === null || vlId === undefined) {
            throw new Error('Required parameter vlId was null or undefined when calling diffNetworksUsingGET.');
        }

        if (voltageEpsilon === null || voltageEpsilon === undefined) {
            throw new Error('Required parameter voltageEpsilon was null or undefined when calling diffNetworksUsingGET.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*',
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<string>('get',`${this.basePath}/v1/networks/${encodeURIComponent(String(network1Uuid))}/diff/${encodeURIComponent(String(network2Uuid))}/vl/${encodeURIComponent(String(vlId))}/${encodeURIComponent(String(epsilon))}/${encodeURIComponent(String(voltageEpsilon))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * compare two networks voltage levels, with threshold
     *
     * @param epsilon Epsilon
     * @param network1Uuid Network1 UUID
     * @param network2Uuid Network2 UUID
     * @param vlId Voltage level ID
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public diffNetworksUsingGET1(epsilon: number, network1Uuid: string, network2Uuid: string, vlId: string, observe?: 'body', reportProgress?: boolean): Observable<string>;
    public diffNetworksUsingGET1(epsilon: number, network1Uuid: string, network2Uuid: string, vlId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
    public diffNetworksUsingGET1(epsilon: number, network1Uuid: string, network2Uuid: string, vlId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
    public diffNetworksUsingGET1(epsilon: number, network1Uuid: string, network2Uuid: string, vlId: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (epsilon === null || epsilon === undefined) {
            throw new Error('Required parameter epsilon was null or undefined when calling diffNetworksUsingGET1.');
        }

        if (network1Uuid === null || network1Uuid === undefined) {
            throw new Error('Required parameter network1Uuid was null or undefined when calling diffNetworksUsingGET1.');
        }

        if (network2Uuid === null || network2Uuid === undefined) {
            throw new Error('Required parameter network2Uuid was null or undefined when calling diffNetworksUsingGET1.');
        }

        if (vlId === null || vlId === undefined) {
            throw new Error('Required parameter vlId was null or undefined when calling diffNetworksUsingGET1.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*',
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<string>('get',`${this.basePath}/v1/networks/${encodeURIComponent(String(network1Uuid))}/diff/${encodeURIComponent(String(network2Uuid))}/vl/${encodeURIComponent(String(vlId))}/${encodeURIComponent(String(epsilon))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * compare two networks voltage levels
     *
     * @param network1Uuid Network1 UUID
     * @param network2Uuid Network2 UUID
     * @param vlId Voltage level ID
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public diffNetworksUsingGET2(network1Uuid: string, network2Uuid: string, vlId: string, observe?: 'body', reportProgress?: boolean): Observable<string>;
    public diffNetworksUsingGET2(network1Uuid: string, network2Uuid: string, vlId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
    public diffNetworksUsingGET2(network1Uuid: string, network2Uuid: string, vlId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
    public diffNetworksUsingGET2(network1Uuid: string, network2Uuid: string, vlId: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (network1Uuid === null || network1Uuid === undefined) {
            throw new Error('Required parameter network1Uuid was null or undefined when calling diffNetworksUsingGET2.');
        }

        if (network2Uuid === null || network2Uuid === undefined) {
            throw new Error('Required parameter network2Uuid was null or undefined when calling diffNetworksUsingGET2.');
        }

        if (vlId === null || vlId === undefined) {
            throw new Error('Required parameter vlId was null or undefined when calling diffNetworksUsingGET2.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*',
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<string>('get',`${this.basePath}/v1/networks/${encodeURIComponent(String(network1Uuid))}/diff/${encodeURIComponent(String(network2Uuid))}/vl/${encodeURIComponent(String(vlId))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * compare two networks substations, with current and voltage thresholds
     *
     * @param epsilon Epsilon
     * @param network1Uuid Network1 UUID
     * @param network2Uuid Network2 UUID
     * @param subId Substation ID
     * @param voltageEpsilon Voltage Epsilon
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public diffSubstationUsingGET(epsilon: number, network1Uuid: string, network2Uuid: string, subId: string, voltageEpsilon: number, observe?: 'body', reportProgress?: boolean): Observable<string>;
    public diffSubstationUsingGET(epsilon: number, network1Uuid: string, network2Uuid: string, subId: string, voltageEpsilon: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
    public diffSubstationUsingGET(epsilon: number, network1Uuid: string, network2Uuid: string, subId: string, voltageEpsilon: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
    public diffSubstationUsingGET(epsilon: number, network1Uuid: string, network2Uuid: string, subId: string, voltageEpsilon: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (epsilon === null || epsilon === undefined) {
            throw new Error('Required parameter epsilon was null or undefined when calling diffSubstationUsingGET.');
        }

        if (network1Uuid === null || network1Uuid === undefined) {
            throw new Error('Required parameter network1Uuid was null or undefined when calling diffSubstationUsingGET.');
        }

        if (network2Uuid === null || network2Uuid === undefined) {
            throw new Error('Required parameter network2Uuid was null or undefined when calling diffSubstationUsingGET.');
        }

        if (subId === null || subId === undefined) {
            throw new Error('Required parameter subId was null or undefined when calling diffSubstationUsingGET.');
        }

        if (voltageEpsilon === null || voltageEpsilon === undefined) {
            throw new Error('Required parameter voltageEpsilon was null or undefined when calling diffSubstationUsingGET.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*',
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<string>('get',`${this.basePath}/v1/networks/${encodeURIComponent(String(network1Uuid))}/diff/${encodeURIComponent(String(network2Uuid))}/sub/${encodeURIComponent(String(subId))}/${encodeURIComponent(String(epsilon))}/${encodeURIComponent(String(voltageEpsilon))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * compare two networks substations, with threshold
     *
     * @param epsilon Epsilon
     * @param network1Uuid Network1 UUID
     * @param network2Uuid Network2 UUID
     * @param subId Substation ID
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public diffSubstationUsingGET1(epsilon: number, network1Uuid: string, network2Uuid: string, subId: string, observe?: 'body', reportProgress?: boolean): Observable<string>;
    public diffSubstationUsingGET1(epsilon: number, network1Uuid: string, network2Uuid: string, subId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
    public diffSubstationUsingGET1(epsilon: number, network1Uuid: string, network2Uuid: string, subId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
    public diffSubstationUsingGET1(epsilon: number, network1Uuid: string, network2Uuid: string, subId: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (epsilon === null || epsilon === undefined) {
            throw new Error('Required parameter epsilon was null or undefined when calling diffSubstationUsingGET1.');
        }

        if (network1Uuid === null || network1Uuid === undefined) {
            throw new Error('Required parameter network1Uuid was null or undefined when calling diffSubstationUsingGET1.');
        }

        if (network2Uuid === null || network2Uuid === undefined) {
            throw new Error('Required parameter network2Uuid was null or undefined when calling diffSubstationUsingGET1.');
        }

        if (subId === null || subId === undefined) {
            throw new Error('Required parameter subId was null or undefined when calling diffSubstationUsingGET1.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*',
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<string>('get',`${this.basePath}/v1/networks/${encodeURIComponent(String(network1Uuid))}/diff/${encodeURIComponent(String(network2Uuid))}/sub/${encodeURIComponent(String(subId))}/${encodeURIComponent(String(epsilon))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * compare two networks substations
     *
     * @param network1Uuid Network1 UUID
     * @param network2Uuid Network2 UUID
     * @param subId Substation ID
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public diffSubstationUsingGET2(network1Uuid: string, network2Uuid: string, subId: string, observe?: 'body', reportProgress?: boolean): Observable<string>;
    public diffSubstationUsingGET2(network1Uuid: string, network2Uuid: string, subId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
    public diffSubstationUsingGET2(network1Uuid: string, network2Uuid: string, subId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
    public diffSubstationUsingGET2(network1Uuid: string, network2Uuid: string, subId: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (network1Uuid === null || network1Uuid === undefined) {
            throw new Error('Required parameter network1Uuid was null or undefined when calling diffSubstationUsingGET2.');
        }

        if (network2Uuid === null || network2Uuid === undefined) {
            throw new Error('Required parameter network2Uuid was null or undefined when calling diffSubstationUsingGET2.');
        }

        if (subId === null || subId === undefined) {
            throw new Error('Required parameter subId was null or undefined when calling diffSubstationUsingGET2.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*',
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<string>('get',`${this.basePath}/v1/networks/${encodeURIComponent(String(network1Uuid))}/diff/${encodeURIComponent(String(network2Uuid))}/sub/${encodeURIComponent(String(subId))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * get network ids
     *
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getNetworkIdsUsingGET(observe?: 'body', reportProgress?: boolean): Observable<{ [key: string]: string; }>;
    public getNetworkIdsUsingGET(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<{ [key: string]: string; }>>;
    public getNetworkIdsUsingGET(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<{ [key: string]: string; }>>;
    public getNetworkIdsUsingGET(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*',
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<{ [key: string]: string; }>('get',`${this.basePath}/v1/networks`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * get substation svg diff diagram, with current and voltage thresholds
     *
     * @param epsilon Epsilon
     * @param network1Uuid Network1 UUID
     * @param network2Uuid Network2 UUID
     * @param subId Substation ID
     * @param voltageEpsilon Voltage Epsilon
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getSubSvgUsingGET(epsilon: number, network1Uuid: string, network2Uuid: string, subId: string, voltageEpsilon: number, observe?: 'body', reportProgress?: boolean): Observable<string>;
    public getSubSvgUsingGET(epsilon: number, network1Uuid: string, network2Uuid: string, subId: string, voltageEpsilon: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
    public getSubSvgUsingGET(epsilon: number, network1Uuid: string, network2Uuid: string, subId: string, voltageEpsilon: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
    public getSubSvgUsingGET(epsilon: number, network1Uuid: string, network2Uuid: string, subId: string, voltageEpsilon: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (epsilon === null || epsilon === undefined) {
            throw new Error('Required parameter epsilon was null or undefined when calling getSubSvgUsingGET.');
        }

        if (network1Uuid === null || network1Uuid === undefined) {
            throw new Error('Required parameter network1Uuid was null or undefined when calling getSubSvgUsingGET.');
        }

        if (network2Uuid === null || network2Uuid === undefined) {
            throw new Error('Required parameter network2Uuid was null or undefined when calling getSubSvgUsingGET.');
        }

        if (subId === null || subId === undefined) {
            throw new Error('Required parameter subId was null or undefined when calling getSubSvgUsingGET.');
        }

        if (voltageEpsilon === null || voltageEpsilon === undefined) {
            throw new Error('Required parameter voltageEpsilon was null or undefined when calling getSubSvgUsingGET.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*',
            'image/svg+xml'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<string>('get',`${this.basePath}/v1/networks/${encodeURIComponent(String(network1Uuid))}/svgdiff/${encodeURIComponent(String(network2Uuid))}/sub/${encodeURIComponent(String(subId))}/${encodeURIComponent(String(epsilon))}/${encodeURIComponent(String(voltageEpsilon))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * get substation svg diff diagram, with threshold
     *
     * @param epsilon Epsilon
     * @param network1Uuid Network1 UUID
     * @param network2Uuid Network2 UUID
     * @param subId Substation ID
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getSubSvgUsingGET1(epsilon: number, network1Uuid: string, network2Uuid: string, subId: string, observe?: 'body', reportProgress?: boolean): Observable<string>;
    public getSubSvgUsingGET1(epsilon: number, network1Uuid: string, network2Uuid: string, subId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
    public getSubSvgUsingGET1(epsilon: number, network1Uuid: string, network2Uuid: string, subId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
    public getSubSvgUsingGET1(epsilon: number, network1Uuid: string, network2Uuid: string, subId: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (epsilon === null || epsilon === undefined) {
            throw new Error('Required parameter epsilon was null or undefined when calling getSubSvgUsingGET1.');
        }

        if (network1Uuid === null || network1Uuid === undefined) {
            throw new Error('Required parameter network1Uuid was null or undefined when calling getSubSvgUsingGET1.');
        }

        if (network2Uuid === null || network2Uuid === undefined) {
            throw new Error('Required parameter network2Uuid was null or undefined when calling getSubSvgUsingGET1.');
        }

        if (subId === null || subId === undefined) {
            throw new Error('Required parameter subId was null or undefined when calling getSubSvgUsingGET1.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*',
            'image/svg+xml'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<string>('get',`${this.basePath}/v1/networks/${encodeURIComponent(String(network1Uuid))}/svgdiff/${encodeURIComponent(String(network2Uuid))}/sub/${encodeURIComponent(String(subId))}/${encodeURIComponent(String(epsilon))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * get substation svg diff diagram
     *
     * @param network1Uuid Network1 UUID
     * @param network2Uuid Network2 UUID
     * @param subId Substation ID
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getSubSvgUsingGET2(network1Uuid: string, network2Uuid: string, subId: string, observe?: 'body', reportProgress?: boolean): Observable<string>;
    public getSubSvgUsingGET2(network1Uuid: string, network2Uuid: string, subId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
    public getSubSvgUsingGET2(network1Uuid: string, network2Uuid: string, subId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
    public getSubSvgUsingGET2(network1Uuid: string, network2Uuid: string, subId: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (network1Uuid === null || network1Uuid === undefined) {
            throw new Error('Required parameter network1Uuid was null or undefined when calling getSubSvgUsingGET2.');
        }

        if (network2Uuid === null || network2Uuid === undefined) {
            throw new Error('Required parameter network2Uuid was null or undefined when calling getSubSvgUsingGET2.');
        }

        if (subId === null || subId === undefined) {
            throw new Error('Required parameter subId was null or undefined when calling getSubSvgUsingGET2.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*',
            'image/svg+xml'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<string>('get',`${this.basePath}/v1/networks/${encodeURIComponent(String(network1Uuid))}/svgdiff/${encodeURIComponent(String(network2Uuid))}/sub/${encodeURIComponent(String(subId))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * get voltage level svg diff diagram, with current and voltage thresholds
     *
     * @param epsilon Epsilon
     * @param network1Uuid Network1 UUID
     * @param network2Uuid Network2 UUID
     * @param vlId Voltage level ID
     * @param voltageEpsilon Voltage Epsilon
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getSvgUsingGET(epsilon: number, network1Uuid: string, network2Uuid: string, vlId: string, voltageEpsilon: number, observe?: 'body', reportProgress?: boolean): Observable<string>;
    public getSvgUsingGET(epsilon: number, network1Uuid: string, network2Uuid: string, vlId: string, voltageEpsilon: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
    public getSvgUsingGET(epsilon: number, network1Uuid: string, network2Uuid: string, vlId: string, voltageEpsilon: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
    public getSvgUsingGET(epsilon: number, network1Uuid: string, network2Uuid: string, vlId: string, voltageEpsilon: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (epsilon === null || epsilon === undefined) {
            throw new Error('Required parameter epsilon was null or undefined when calling getSvgUsingGET.');
        }

        if (network1Uuid === null || network1Uuid === undefined) {
            throw new Error('Required parameter network1Uuid was null or undefined when calling getSvgUsingGET.');
        }

        if (network2Uuid === null || network2Uuid === undefined) {
            throw new Error('Required parameter network2Uuid was null or undefined when calling getSvgUsingGET.');
        }

        if (vlId === null || vlId === undefined) {
            throw new Error('Required parameter vlId was null or undefined when calling getSvgUsingGET.');
        }

        if (voltageEpsilon === null || voltageEpsilon === undefined) {
            throw new Error('Required parameter voltageEpsilon was null or undefined when calling getSvgUsingGET.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*',
            'image/svg+xml'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<string>('get',`${this.basePath}/v1/networks/${encodeURIComponent(String(network1Uuid))}/svgdiff/${encodeURIComponent(String(network2Uuid))}/vl/${encodeURIComponent(String(vlId))}/${encodeURIComponent(String(epsilon))}/${encodeURIComponent(String(voltageEpsilon))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * get voltage level svg diff diagram, with threshold
     *
     * @param epsilon Epsilon
     * @param network1Uuid Network1 UUID
     * @param network2Uuid Network2 UUID
     * @param vlId Voltage level ID
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getSvgUsingGET1(epsilon: number, network1Uuid: string, network2Uuid: string, vlId: string, observe?: 'body', reportProgress?: boolean): Observable<string>;
    public getSvgUsingGET1(epsilon: number, network1Uuid: string, network2Uuid: string, vlId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
    public getSvgUsingGET1(epsilon: number, network1Uuid: string, network2Uuid: string, vlId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
    public getSvgUsingGET1(epsilon: number, network1Uuid: string, network2Uuid: string, vlId: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (epsilon === null || epsilon === undefined) {
            throw new Error('Required parameter epsilon was null or undefined when calling getSvgUsingGET1.');
        }

        if (network1Uuid === null || network1Uuid === undefined) {
            throw new Error('Required parameter network1Uuid was null or undefined when calling getSvgUsingGET1.');
        }

        if (network2Uuid === null || network2Uuid === undefined) {
            throw new Error('Required parameter network2Uuid was null or undefined when calling getSvgUsingGET1.');
        }

        if (vlId === null || vlId === undefined) {
            throw new Error('Required parameter vlId was null or undefined when calling getSvgUsingGET1.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*',
            'image/svg+xml'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<string>('get',`${this.basePath}/v1/networks/${encodeURIComponent(String(network1Uuid))}/svgdiff/${encodeURIComponent(String(network2Uuid))}/vl/${encodeURIComponent(String(vlId))}/${encodeURIComponent(String(epsilon))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * get voltage level svg diff diagram
     *
     * @param network1Uuid Network1 UUID
     * @param network2Uuid Network2 UUID
     * @param vlId Voltage level ID
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getSvgUsingGET2(network1Uuid: string, network2Uuid: string, vlId: string, observe?: 'body', reportProgress?: boolean): Observable<string>;
    public getSvgUsingGET2(network1Uuid: string, network2Uuid: string, vlId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
    public getSvgUsingGET2(network1Uuid: string, network2Uuid: string, vlId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
    public getSvgUsingGET2(network1Uuid: string, network2Uuid: string, vlId: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (network1Uuid === null || network1Uuid === undefined) {
            throw new Error('Required parameter network1Uuid was null or undefined when calling getSvgUsingGET2.');
        }

        if (network2Uuid === null || network2Uuid === undefined) {
            throw new Error('Required parameter network2Uuid was null or undefined when calling getSvgUsingGET2.');
        }

        if (vlId === null || vlId === undefined) {
            throw new Error('Required parameter vlId was null or undefined when calling getSvgUsingGET2.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*',
            'image/svg+xml'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<string>('get',`${this.basePath}/v1/networks/${encodeURIComponent(String(network1Uuid))}/svgdiff/${encodeURIComponent(String(network2Uuid))}/vl/${encodeURIComponent(String(vlId))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
