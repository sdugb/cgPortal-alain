import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { _HttpClient } from '@delon/theme';

@Injectable()
export class TeamService {
    teamList: any = [];
    subProjectList: any = [];

    constructor (private http: _HttpClient) {

    }

    createTeam(team) {
        console.log(team);
        return this.http
            .post('cgserver/createTeam', {'team': team})
            .pipe(catchError(this.handleError));
    }

    deleteTeam(team_id) {
        return this.http
            .post('cgserver/deleteTeam', {'id': team_id})
            .pipe(catchError(this.handleError));
    }

    createProject(project) {
        return this.http
            .post('cgserver/createProject', {'project': project})
            .pipe(catchError(this.handleError));
    }

    deleteProject(project_id) {
        return this.http
            .post('cgserver/deleteProject', {'id': project_id})
            .pipe(catchError(this.handleError));
    }

    createSubProject(subProject) {
        return this.http
            .post('cgserver/createSubProject', {'subProject': subProject})
            .pipe(catchError(this.handleError));
    }

    deleteSubProject(subProject_id) {
        return this.http
            .post('cgserver/deleteSubProject', {'id': subProject_id})
            .pipe(catchError(this.handleError));
    }

    getMyTeams(user) {
        console.log('getMyTeams');
        return this.http
            .post('cgserver/getMyTeams', {'user': user})
            .pipe(catchError(this.handleError));

    }

    getMyProjects(user) {
        return this.http
            .post('cgserver/getMyProjects', {'user': user})
            .pipe(catchError(this.handleError));
    }

    getMySubProjects(user) {
        return this.http
            .post('cgserver/getMySubProjects', {'user': user})
            .pipe(catchError(this.handleError));
    }

    getMyTeamSubProjects(user, team, project) {
        return this.http
            .post('cgserver/getMyTeamSubProjects', {'user': user, 'team': team, 'project': project})
            .pipe(catchError(this.handleError));
    }

    getMyTemplates(user) {
        return this.http
            .post('cgserver/getMyTemplates', {'user': user})
            .pipe(catchError(this.handleError));
    }

    createTemplate(template) {
        return this.http
            .post('cgserver/createTemplate', {'template': template})
            .pipe(catchError(this.handleError));
    }

    deleteTemplate(template_id) {
        return this.http
            .post('cgserver/deleteTemplate', {'id': template_id})
            .pipe(catchError(this.handleError));
    }

    private handleError (error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        return Observable.throw(error || "Server Error");
    }

    setTeamList(teamList) {
        this.teamList = teamList;
    }

    getTeamList() {
        return this.teamList;
    }

    setSubProjectList(subProjectList) {
        this.subProjectList = subProjectList;
        console.log(this.subProjectList);
    }

    getSubProjectList() {
        console.log(this.subProjectList);
        return this.subProjectList;
    }
}

