import { ForbiddenException } from '@/exceptions/http-exception';
import { NextFunction, Request, Response } from 'express';
import { BaseHttpResponse } from '@/lib/base-http-response';
import { EventService } from '@/services/events.service';

export class EventController {
	private readonly _eventService = new EventService();
	constructor() {
		this.getEvents = this.getEvents.bind(this);
		this.getEventById = this.getEventById.bind(this);
		this.add = this.add.bind(this);
		this.update = this.update.bind(this);
		this.deleteEvent = this.deleteEvent.bind(this);
		this.get = this.get.bind(this);
		this.participate = this.participate.bind(this);
		this.getUpcomingEvents = this.getUpcomingEvents.bind(this);
		this.cancelParticipation = this.cancelParticipation.bind(this);
		this.getEventParticipated = this.getEventParticipated.bind(this);
	}

	async get(req: Request, res: Response, next: NextFunction): Promise<any>{
		try{
			const options = req.query;
			const {skip: _skip, take: _take, ...rest} = options;
			void _skip;
			void _take;
			const skip = parseInt(options.skip as string);
			const take = parseInt(options.take as string);
			console.log(skip, take);
			const {events, total} = await this._eventService.get(rest, skip, take);
			const response = BaseHttpResponse.success({events, total}, 200, 'Get events success');
			return res.status(response.statusCode).json(response);
		}
		catch(error){
			next(error);
		}
	}

	async getEvents(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<any> {
		try {
			const events = await this._eventService.getEvents();
			const response = BaseHttpResponse.success(
				events,
				200,
				'Get events success'
			);
			return res.status(response.statusCode).json(response);
		} catch (error) {
			next(error);
		}
	}



	async getEventById(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<any> {
		try {
			const event = await this._eventService.getEventById(req.params.id);
			const response = BaseHttpResponse.success(
				event,
				200,
				'Get event success'
			);
			return res.status(response.statusCode).json(response);
		} catch (error) {
			next(error);
		}
	}


	async add(req: Request,
		res: Response,
		next: NextFunction): Promise<any> {
		try {
			const userId = req.userId;
			//valid userid
			if (!userId) {
				throw new ForbiddenException('Forbidden');
			}
			const {
				title,
				description,
				type,
				startDate,
				endDate,
				status,
				organizer,
				image,
				link
			} = req.body;

			const event = await this._eventService.add(
				title,
				description,
				type,
				startDate,
				endDate,
				status,
				organizer,
				image,
				link,
				userId
			)
			const response = BaseHttpResponse.success(event, 201, 'Add event success');
			console.log(response);
			return res.status(response.statusCode).json(response);
			
		} catch (error) {
			next(error);
		}
	}	
		
	async update(req: Request, res: Response, next: NextFunction): Promise<any> {
		try {
			const {id} = req.params;
			const userId = req.userId;
			
			//valid userid
			if (!userId) {
				throw new ForbiddenException('Forbidden');
			}
			const {
				title,
				description,
				type,
				startDate,
				endDate,
				status,
				organizer,
				image,
				link
			} = req.body;
			console.log(userId,req.body);
			const event = await this._eventService.update(
				id,
				title,
				description,
				type,
				startDate,
				endDate,
				status,
				organizer,
				image,
				link,
			);
			const response = BaseHttpResponse.success(event, 201, 'Update event success');
			console.log(response);
			return res.status(response.statusCode).json(response);

		} catch(error){
			next(error)
		}
	}


	async deleteEvent(req: Request, res: Response, next: NextFunction): Promise<any> {
		const userId = req.userId;
		if (!userId) {
			throw new ForbiddenException('Forbidden');
		}
		const role = req.userRole!;
		const eventId = req.params.id;
		try {
			await this._eventService.deleteEvent(eventId, role);
			const response = BaseHttpResponse.success(null, 204, 'Delete event success');
			return res.status(response.statusCode).json(response);
		}
		catch (error) {
			next(error);
		}

	}

	async participate(req: Request, res: Response, next: NextFunction): Promise<any> {
		const userId = req.userId;
		if (!userId) {
			throw new ForbiddenException('Forbidden');
		}
		const eventId = req.params.id;
		try{
			const event = await this._eventService.participate(eventId, userId);
			const response = BaseHttpResponse.success(event, 200, 'Participate in event success');
			return res.status(response.statusCode).json(response);
		}
		catch(error){
			next(error);
		}
	}

	async cancelParticipation(req: Request, res: Response, next: NextFunction): Promise<any> {
		const userId = req.userId;
		if (!userId) {
			throw new ForbiddenException('Forbidden');
		}
		const eventId = req.params.id;
		try{
			const event = await this._eventService.cancelParticipation(eventId, userId);
			const response = BaseHttpResponse.success(event, 200, 'Cancel participation in event success');
			return res.status(response.statusCode).json(response);
		}
		catch(error){
			next(error);
		}
	}

	async getUpcomingEvents(req: Request, res: Response, next: NextFunction): Promise<any> {
		try {
			const events = await this._eventService.getUpcomingEvent();
			const response = BaseHttpResponse.success(
				events,
				200,
				'Get upcoming events success'
			);
			return res.status(response.statusCode).json(response);
		} catch (error) {
			next(error);
		}
	}

	async getEventParticipated(req: Request, res: Response, next: NextFunction): Promise<any> {
		try {
			const userId = req.userId;
			if (!userId) {
				throw new ForbiddenException('Forbidden');
			}
			const events = await this._eventService.getEventParticipated(userId);
			const response = BaseHttpResponse.success(
				events,
				200,
				'Get events participated success'
			);
			return res.status(response.statusCode).json(response);
		} catch (error) {
			next(error);
		}
	}

}
