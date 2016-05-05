// Developed for TKD-Score-Server by Mick Crozier 2015
// MIT License
// adapted from: https://raw.githubusercontent.com/MickCrozier/timer-stopwatch/master/lib/Stopwatch.js


enum StopwatchStatus {
    STOPPED,
    RUNNING,
    COMPLETE,
}

class Stopwatch {

    private stoptime: number;
    private refTime: number;
    private tickTimer: number;
    private almostDoneFired: boolean;
    private doneFired: boolean;
    private countDownMS: number;
    public ms: number;
    private _elapsedMS: number;
    private state: StopwatchStatus;
    private refreshRateMS: number;
    private almostDoneMS: number;

    constructor(countDownMS?, options?) {
        this.stoptime = 0;  			// the time the clock has been paused at
    	this.refTime = 0;				// reference time when started

    	this.tickTimer = 0;				// interval timer for updateTime

    	this.almostDoneFired = false;	// true if almostDone event has been fired (prevent mlti hits)
    	this.doneFired = false;			// true if done event has been fired (prevent multi hits)

    	this.countDownMS = countDownMS || false;
        if (countDownMS) {
            this.ms = countDownMS;
        } else {
            this.ms = 0;
        }
    	this._elapsedMS = 0;			// number if elapsed milliseconds
    	this.state = StopwatchStatus.STOPPED;	// current status of the timer-stopwatch


    	//// options
    	if(!options) {options = {};}
    	this.refreshRateMS = options.refreshRateMS || 10; // must be a number smaller than 16 (1000ms/60 fps)
    	this.almostDoneMS = options.almostDoneMS || 10000;


    	//// init
    	this.reset(countDownMS);
    }

    /**
	 * Start the timer
	 */
    public start() {
        if (this.tickTimer) {
            clearInterval(this.tickTimer);
        }
        this.state = StopwatchStatus.RUNNING;

        this.refTime = new Date().getTime();
        this.refTime -= this._elapsedMS;
        var self = this;
        this.tickTimer = setInterval(function(){self._updateTime();}, this.refreshRateMS);
        this._updateTime();
    }

    /**
	 * Stops the timer
	 *
	 * Emits the event forcestop,
	 * with one parameter passed to the callback,
	 * that consists of the elapsed time.
	 */
	public stop() {
		if(this.tickTimer) {
            clearInterval(this.tickTimer);
        }
        if(this.state === StopwatchStatus.RUNNING) {
            this.state = StopwatchStatus.STOPPED; // prevents updatedTime being called in an infinite loop
            this._updateTime();
        }
	}

    /**
	 * Stop a timer, and reset it to it's defaults.
	 * Change the countdown value, if a paramter is provided.
	 *
	 * @param {Integer} Milliseconds to set the timer to.
	 */
	public reset(countDownMS) {
		this.stop();
		this.state = StopwatchStatus.STOPPED;
		this.doneFired = false;
		this.almostDoneFired = false;
		this._elapsedMS = 0;
		this.refTime = new Date().getTime();

		if(countDownMS) {
			this.countDownMS = countDownMS;
		}
        if (this.countDownMS) {
            this.ms = countDownMS;
        } else {
            this.ms = 0;
        }
	}

    /**
	 * Toggle the state of the timer.
	 * If one of start or stop is given as a argument to the
	 * function then the timer will be forced into that state.
	 *
	 * If no argument is given, then the timer's state will be toggled
	 * between start and stop.
	 * i.e. The timer will be stopped, if it is running, and the timer
	 * will be started if the timer is already stopped.
	 *
	 * @param {String} start|stop Optional paramter.
	 * @returns {Boolean} true if the timer is running, false otherwise.
	 */

	private startstop() {
		if(this.state === StopwatchStatus.STOPPED) {
            this.start();
            return true;
        } else {
            this.stop();
            return false;
        }
	}

    /**
	 * Updates the time
	 * @private
	 */
	private _updateTime() {
		var self = this;
        if(self.countDownMS > 0) {
        	self._timerCountdown();
        } else {
        	self._stopwatchCountup();
        }
	}

    private _timerCountdown() {
		var self = this;
		var currentTime = new Date().getTime();
        //Find the difference between current time and start time.
        self._elapsedMS = currentTime - self.refTime;


        var remainingSeconds = self.countDownMS - self._elapsedMS;
        if(remainingSeconds < 0) {
        	remainingSeconds = 0;
        }

        self.ms = remainingSeconds;

        if(remainingSeconds <= 0) {
            self.stop(); // stop the clock
            if(!self.doneFired) {
                self.doneFired = true;
                self.state = StopwatchStatus.COMPLETE;
            }
        } else if (remainingSeconds < self.almostDoneMS) {
            if(!self.almostDoneFired) {
                self.almostDoneFired = true;
            }
        }

	}

    /**
	 * Updates the time for stopwatch
	 * @private
	 */
	private _stopwatchCountup() {
		var self = this;
		var currentTime = new Date().getTime();

		self._elapsedMS = currentTime - self.refTime;
        self.ms = self._elapsedMS;
	}
}
