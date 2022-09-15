import { All, Controller, HttpStatus, Next, Req, Res } from "@nestjs/common";
import { NextFunction, Response } from "express";
import Request from "../../types/Request";
import ApiException from "../../filters/classes/ApiException";

@Controller()
class GuardController {
  private grd = (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
      next();
    } else {
      throw new ApiException("not logged in", HttpStatus.UNAUTHORIZED);
    }
  };

  @All("/api/v1/~")
  public async guardRoot(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ): Promise<void> {
    this.grd(req, res, next);
  }

  @All("/api/v1/~/*")
  public async guard(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ): Promise<void> {
    this.grd(req, res, next);
  }
}

export default GuardController;
